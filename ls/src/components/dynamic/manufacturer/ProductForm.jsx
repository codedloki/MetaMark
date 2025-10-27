import React, { useState, useRef } from "react";
import { GridBackground } from "../../static/pages/CustomBack";
import Breadcrumb from "../../custom/Breadcrumb";
import { jsPDF } from "jspdf";
import AddProductForm from "./Products/AddProductJSON.jsx";
import SelectProductForm from "./Products/SelectProductForm";
import BatchForm from "./Products/BatchForm";
import Barcode from "react-barcode";

// Helper to generate checksum for barcode
function generateChecksum(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
  return (sum % 256).toString(16).padStart(2, '0');
}

const svgToImageDataUrl = (svgElement) =>
  new Promise((resolve, reject) => {
    try {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const img = new window.Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const rect = svgElement.getBoundingClientRect();
        canvas.width = rect.width || 200;
        canvas.height = rect.height || 80;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        URL.revokeObjectURL(svgUrl);
        resolve(dataUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(svgUrl);
        reject(new Error('Failed to load SVG'));
      };

      img.src = svgUrl;
    } catch (error) {
      reject(error);
    }
  });

export default function ProductForm() {
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: "Add", href: "/add/" }
  ]);
  const [stage, setStage] = useState("buttons"); // "buttons", "selectProduct", "BatchForm", "productForm"
  const [selectedProductId, setSelectedProductId] = useState("");
  const [batchJson, setBatchJson] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [barcodes, setBarcodes] = useState([]);
  const svgRefs = useRef([]);
  const containerRefs = useRef([]);

  // Dummy product list for select dropdown (replace with real data as needed)
  const products = [
    { id: "prod1", name: "Paracetamol" },
    { id: "prod2", name: "Ibuprofen" }
  ];

  const handleAddProductClick = () => {
    setBreadcrumbItems([
      { label: "Add", href: "/add/" },
      { label: "New Product" }
    ]);
    setStage("productForm");
  };

  const handleAddBatchClick = () => {
    setBreadcrumbItems([
      { label: "Add", href: "/add/" },
      { label: "Select Product" }
    ]);
    setStage("selectProduct");
  };

  const handleSelectProductSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    setBreadcrumbItems([
      { label: "Add", href: "/add/" },
      { label: "Select Product" },
      { label: "Batch" }
    ]);
    setStage("BatchForm");
  };

  // Handle JSON file upload and barcode generation
  const handleBatchFileChange = (e) => {
    setJsonError("");
    setBarcodes([]);
    const file = e.target.files[0];
    if (!file) {
      setBatchJson("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const json = JSON.parse(text);
        setBatchJson(text);
        setJsonError("");

        // Validate and generate barcodes
        if (
          json &&
          json.batchId &&
          Array.isArray(json.serials) &&
          json.serials.length > 0
        ) {
          const barcodeList = json.serials.map((serial, idx) => {
            const barcodeData = `${json.batchId}_${serial}_${generateChecksum(json.batchId + serial)}`;
            return {
              serial,
              barcodeData,
              batchId: json.batchId,
              mfgDate: json.mfgDate,
              expiryDate: json.expiryDate,
              ipfsHash: json.ipfsHash,
              merkleRoot: json.merkleRoot,
            };
          });
          setBarcodes(barcodeList);
        } else {
          setBarcodes([]);
          setJsonError("JSON missing required fields or serials array.");
        }
      } catch (err) {
        setBatchJson("");
        setBarcodes([]);
        setJsonError("Invalid JSON file.");
      }
    };
    reader.onerror = () => {
      setBatchJson("");
      setBarcodes([]);
      setJsonError("Error reading file.");
    };
    reader.readAsText(file);
  };

  const handleBatchFormSubmit = (e) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(batchJson);
      setJsonError("");
      // Submit parsed batch data here
      alert("Batch JSON submitted successfully!");
      // Reset form or go back as needed
    } catch (err) {
      setJsonError("Invalid JSON format.");
    }
  };

  const generatePdf = async () => {
    if (!barcodes.length) {
      alert('Upload a batch first!');
      return;
    }

    try {
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;
      const barcodeWidth = 300;
      const barcodeHeight = 120;
      const verticalSpacing = 180;
      let currentY = margin;

      for (let i = 0; i < barcodes.length; i++) {
        let svgElement = svgRefs.current[i];
        if (!svgElement && containerRefs.current[i]) {
          svgElement = containerRefs.current[i].querySelector('svg');
          if (svgElement) svgRefs.current[i] = svgElement;
        }
        if (!svgElement) continue;

        const imageDataUrl = await svgToImageDataUrl(svgElement);

        if (currentY + verticalSpacing > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.setFontSize(14).setFont(undefined, 'bold');
        pdf.text(barcodes[i].serial, margin, currentY);

        pdf.addImage(
          imageDataUrl,
          'PNG',
          (pageWidth - barcodeWidth) / 2,
          currentY + 20,
          barcodeWidth,
          barcodeHeight
        );

        pdf.setFontSize(10).setFont(undefined, 'normal');
        pdf.text(barcodes[i].barcodeData, margin, currentY + barcodeHeight + 40);

        currentY += verticalSpacing;
      }

      pdf.save(`barcodes_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      alert('Error creating PDF file.');
    }
  };

  // Example JSON format for batch data
  const exampleBatchJson = `{
  "batchId": "BATCH001",
  "mfgDate": "2024-01-01",
  "expiryDate": "2026-01-01",
  "ipfsHash": "Qm...",
  "merkleRoot": "0x...",
  "serials": [
    "SERIAL001",
    "SERIAL002"
  ]
}`;

  return (
    <div className="mt-4 text-3xl text-white">
      <GridBackground className="pl-[30vh] md:pl-0 h-screen overflow-y-scroll relative">
        <div className="relative flex flex-col font-[Manrope,_'Noto_Sans',_sans-serif] min-h-screen mt-[100vh] md:mt-[40vh] md:w-[100vh] pt-[35vh] md:pt-[0vh] ml-[20vh] md:ml-[10vh] mr-[20vh] overflow-y-auto md:mb-[10vh]">
          <Breadcrumb items={breadcrumbItems} />
          <br />
          <div>
            {stage === "buttons" ? (
              <>
                <button onClick={handleAddProductClick}>Add New Product</button>
                <br /><br />
                <button onClick={handleAddBatchClick}>Add New Batch</button>
              </>
            ) : stage === "productForm" ? (
              <AddProductForm
                onBack={() => {
                  setStage("buttons");
                  setBreadcrumbItems([{ label: "Add", href: "/add/" }]);
                }}
              />
            ) : stage === "selectProduct" ? (
              <SelectProductForm
                products={products}
                selectedProductId={selectedProductId}
                setSelectedProductId={setSelectedProductId}
                onBack={() => {
                  setStage("buttons");
                  setBreadcrumbItems([{ label: "Add", href: "/add/" }]);
                  setSelectedProductId("");
                }}
                onSubmit={handleSelectProductSubmit}
              />
            ) : stage === "BatchForm" ? (
              <BatchForm
                handleBatchFileChange={handleBatchFileChange}
                jsonError={jsonError}
                exampleBatchJson={exampleBatchJson}
                barcodes={barcodes}
                onBack={() => {
                  setStage("selectProduct");
                  setBreadcrumbItems([
                    { label: "Add", href: "/add/" },
                    { label: "Select Product" }
                  ]);
                  setBatchJson("");
                  setBarcodes([]);
                  setJsonError("");
                }}
                onSubmit={handleBatchFormSubmit}
                generatePdf={generatePdf}
                batchJson={batchJson}
              />
            ) : null}
          </div>
        </div>
      </GridBackground>
    </div>
  );
}