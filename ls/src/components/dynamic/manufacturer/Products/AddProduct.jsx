import React, { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import Barcode from 'react-barcode';
import { jsPDF } from 'jspdf';
import { GridBackground } from '../../../static/pages/CustomBack';

// Helper to generate checksum for barcode
function generateChecksum(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
  return (sum % 256).toString(16).padStart(2, '0');
}

function AddProduct() {
  const [products, setProducts] = useState({});
  const [flatProducts, setFlatProducts] = useState([]);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [isReadyToDownload, setIsReadyToDownload] = useState(false);
  const svgRefs = useRef([]);
  const containerRefs = useRef([]);

  // -------------------------------
  // Parse CSV into nested + flat data
  // -------------------------------
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    let allRows = [];
    let processedFiles = 0;

    const processFile = (file) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          allRows = [...allRows, ...results.data];
          processedFiles++;

          if (processedFiles === files.length) {
            const structuredData = {};
            const flatData = [];

            allRows.forEach((row, i) => {
              const productName = (row['Product Name'] || '').trim();
              const batchId = (row['Batch id'] || '').trim();
              const serialId = (row['serial_id'] || '').trim();
              const mfg = (row['mfg_date'] || '').trim();
              const exp = (row['exp_date'] || '').trim();
              const desc = (row['description'] || '').trim();
              const sideEffects = (row['sideeffects'] || '').trim();

              const barcodeData = `${batchId}_${serialId}_${generateChecksum(
                batchId + serialId
              )}`;

              // Nested product structure
              if (!structuredData[productName]) {
                structuredData[productName] = { product_name: productName, batches: {} };
              }
              if (!structuredData[productName].batches[batchId]) {
                structuredData[productName].batches[batchId] = [];
              }

              const unit = {
                batch_id: batchId,
                serial_id: serialId,
                mfg_date: mfg,
                exp_date: exp,
                description: desc,
                sideeffects: sideEffects,
                barcodeData: barcodeData,
              };

              structuredData[productName].batches[batchId].push(unit);

              // Flat data for grid/PDF
              flatData.push({
                index: i,
                product_name: productName,
                batch_id: batchId,
                serial_id: serialId,
                barcodeData: barcodeData,
              });
            });

            setProducts(structuredData);
            setFlatProducts(flatData);
          }
        },
        error: (err) => {
          console.error('Error parsing CSV:', err);
          processedFiles++;
        },
      });
    };

    files.forEach(processFile);
  };

  // -------------------------------
  // Check if barcodes rendered
  // -------------------------------
  useEffect(() => {
    if (!flatProducts.length) {
      setIsReadyToDownload(false);
      return;
    }
    const timer = setTimeout(() => {
      const ready = flatProducts.every((_, i) => {
        let svgElement = svgRefs.current[i];
        if (!svgElement && containerRefs.current[i]) {
          svgElement = containerRefs.current[i].querySelector('svg');
          if (svgElement) svgRefs.current[i] = svgElement;
        }
        return svgElement?.tagName?.toLowerCase() === 'svg';
      });
      setIsReadyToDownload(ready);
    }, 500);

    return () => clearTimeout(timer);
  }, [flatProducts]);

  // -------------------------------
  // Convert SVG to PNG
  // -------------------------------
  const svgToImageDataUrl = (svgElement) =>
    new Promise((resolve, reject) => {
      try {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const img = new Image();

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

  // -------------------------------
  // Generate PDF of barcodes
  // -------------------------------
  const generatePdf = async () => {
    if (!flatProducts.length) {
      alert('Upload some products first!');
      return;
    }

    setLoadingPdf(true);
    try {
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 40;
      const barcodeWidth = 300;
      const barcodeHeight = 120;
      const verticalSpacing = 180;
      let currentY = margin;

      for (let i = 0; i < flatProducts.length; i++) {
        const svgElement = svgRefs.current[i];
        if (!svgElement) continue;

        const imageDataUrl = await svgToImageDataUrl(svgElement);

        if (currentY + verticalSpacing > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.setFontSize(14).setFont(undefined, 'bold');
        pdf.text(flatProducts[i].product_name, margin, currentY);

        pdf.addImage(
          imageDataUrl,
          'PNG',
          (pageWidth - barcodeWidth) / 2,
          currentY + 20,
          barcodeWidth,
          barcodeHeight
        );

        pdf.setFontSize(10).setFont(undefined, 'normal');
        pdf.text(flatProducts[i].barcodeData, margin, currentY + barcodeHeight + 40);

        currentY += verticalSpacing;
      }

      pdf.save(`barcodes_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Error creating PDF:', err);
      alert('Error creating PDF file.');
    }
    setLoadingPdf(false);
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <GridBackground className="h-screen overflow-y-auto px-4 py-8 md:px-8">
      <div className="flex flex-col items-center space-y-8 max-w-7xl mx-auto w-full">
        <h1 className="text-white text-3xl md:text-5xl font-bold text-center">
          Add Products (Bulk Upload)
        </h1>

        {/* Upload box */}
        <div className="w-full max-w-xl">
          <div className="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition">
            <div className="absolute flex flex-col items-center">
              <img
                alt="File Icon"
                className="h-10 mb-3"
                src="https://cdn-icons-png.flaticon.com/512/9496/9496460.png"
              />
              <span className="block text-gray-500 font-semibold">
                Drag & drop your files here
              </span>
              <span className="block text-gray-400 text-sm mt-1">
                or click to upload
              </span>
            </div>
            <input
              type="file"
              accept=".csv,text/csv"
              multiple
              className="h-full w-full opacity-0 cursor-pointer"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Status */}
        {flatProducts.length > 0 && (
          <div className="text-white text-center">
            <p className="text-lg">
              Loaded <span className="font-semibold">{flatProducts.length}</span> units
            </p>
            <p className="text-sm opacity-75">
              {isReadyToDownload ? 'Ready to download' : 'Preparing barcodes...'}
            </p>
          </div>
        )}

        {/* Barcode grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 rounded-lg bg-white shadow">
          {flatProducts.length > 0 ? (
            flatProducts.map((prod, i) => (
              <div
                key={i}
                className="flex flex-col items-center border p-4 rounded shadow hover:shadow-lg transition"
                ref={(el) => (containerRefs.current[i] = el)}
              >
                <h3 className="font-semibold mb-2 text-center">{prod.product_name}</h3>
                <Barcode
                  value={prod.barcodeData}
                  width={2}
                  height={80}
                  render="svg"
                  background="#fff"
                  lineColor="#000"
                />
                <p className="text-xs mt-2 break-all text-center">
                  {prod.barcodeData}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No products uploaded yet.
            </p>
          )}
        </div>

        {/* Download Button */}
        <button
          onClick={generatePdf}
          disabled={!isReadyToDownload || loadingPdf}
          className={`px-6 py-3 rounded-lg text-white font-medium shadow transition ${isReadyToDownload && !loadingPdf
              ? 'bg-red-600 hover:bg-red-500'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          {loadingPdf
            ? 'Preparing PDF...'
            : `Download ${flatProducts.length} Barcodes as PDF`}
        </button>
      </div>
    </GridBackground>
  );
}

export default AddProduct;
