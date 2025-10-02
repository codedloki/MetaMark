import React, { useEffect, useRef, useState } from "react";
import { GridBackground } from "../../static/pages/CustomBack";
import InteractiveGradient from "../../custom/InteractiveCard";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { ethers } from "ethers";
import ProductsAbi from "../../../abi/Products.json";
import axios from "axios";
import { MerkleTree } from "merkletreejs";
import CryptoJS from "crypto-js";
import { Buffer } from "buffer";

window.Buffer = Buffer;

const sha256 = (data) => {
  const wordArray = CryptoJS.lib.WordArray.create(data);
  const hash = CryptoJS.SHA256(wordArray);
  return Buffer.from(hash.toString(CryptoJS.enc.Hex), "hex");
};

// Clean barcode text and decode
function decodeShortBarcode(shortBarcode) {
  shortBarcode = shortBarcode.trim(); // ✅ Trim spaces/newlines
  const parts = shortBarcode.split("_");
  if (parts.length !== 3) return null;
  return {
    productShortId: parts[0].toLowerCase(),
    batchId: parts[1],
    serialId: parts[2],
  };
}

const QrBarcodeScanner = ({ onScan }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = async () => {
    if (isScanning) return;
    scannerRef.current = new Html5Qrcode("scanner");

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128],
        },
        async (decodedText) => {
          console.log("📡 Scanned text:", decodedText);
          if (onScan && typeof onScan === "function") {
            await onScan(decodedText.trim()); // ✅ Trim text before passing
          }
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error("Scanner error:", err);
    }
  };

  const stopScanning = async () => {
    if (!scannerRef.current) return;
    await scannerRef.current.stop();
    await scannerRef.current.clear();
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div
        id="scanner"
        style={{ width: "100%", height: "300px", background: "#000" }}
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={startScanning}
          disabled={isScanning}
          className="bg-green-600 px-4 py-2 text-white rounded"
        >
          Start Scanner
        </button>
        <button
          onClick={stopScanning}
          disabled={!isScanning}
          className="bg-red-600 px-4 py-2 text-white rounded"
        >
          Stop Scanner
        </button>
      </div>
    </div>
  );
};

function Verification() {
  const [dialog, setDialog] = useState({
    show: false,
    message: "",
    type: "info",
  });
  const [testSerial, setTestSerial] = useState("");
  const [serials, setSerials] = useState([]);

  const verifySerial = async (shortBarcode) => {
    const decoded = decodeShortBarcode(shortBarcode);
    if (!decoded) {
      setDialog({
        show: true,
        message: "❌ Invalid barcode format",
        type: "error",
      });
      return;
    }

    const { productShortId, batchId, serialId } = decoded;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_PRODUCT_REGISTRY,
        ProductsAbi,
        signer
      );

      const productIds = await contract.getProductsByManufacturer();
      console.log("Product Short ID:", productShortId);
      console.log(
        "Product IDs:",
        productIds.map((pid) => pid.toString())
      );
      console.log("Decoded Barcode:", decoded);
      console.log("Product IDs:",productIds );
      // ✅ More robust product ID matching
      const productId = productIds.find((pid) =>
        pid.toString().toLowerCase().includes(productShortId)
      );
      console.log(
        "Resolved Product ID:",
        productId ? productId.toString() : "Not found"
      );
      if (!productId) throw new Error("Product not found");

      const batch = await contract.getBatch(productId, batchId.toString());
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${batch.ipfsHash}`;
      const { data } = await axios.get(ipfsUrl);

      console.log("Fetched IPFS Data:", data);
      setSerials(data.serials);

      const searchString = `${productShortId}_${batchId}_${serialId}`;
      console.log("Searching for:", searchString);

      const exists = data.serials.some(
        (s) => s.shortBarcode.toLowerCase() === searchString.toLowerCase()
      );

      const serialEntry = data.serials.find(
        (s) => s.serialId.toString() === serialId.toString()
      );
      if (!serialEntry) throw new Error("Serial not found in batch");

      const leafHashes = data.serials.map((s) =>
        Buffer.from(s.leafHash.replace(/^0x/, ""), "hex")
      );
      const tree = new MerkleTree(leafHashes, sha256, { sortPairs: true });
      const proof = tree
        .getProof(Buffer.from(serialEntry.leafHash.replace(/^0x/, ""), "hex"))
        .map((p) => "0x" + p.data.toString("hex"));

      setDialog({
        show: true,
        message: exists ? "✅ Verified Successfully!" : "❌ Verification failed",
        type: exists ? "success" : "error",
      });
    } catch (err) {
      console.error(err);
      setDialog({
        show: true,
        message: "❌ Verification failed: " + err.message,
        type: "error",
      });
    }
  };

  return (
    <GridBackground className="px-4 pt-20 h-screen flex flex-col items-center">
      <h1 className="text-white text-3xl mb-6">Verification</h1>

      <div className="mb-6 flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter Serial Barcode"
          value={testSerial}
          onChange={(e) => setTestSerial(e.target.value)}
          className="px-4 py-2 rounded text-black"
        />
        <button
          onClick={() => verifySerial(testSerial.trim())}
          className="mt-3 bg-blue-600 px-4 py-2 rounded text-white"
        >
          Test Verify
        </button>
      </div>

      <InteractiveGradient
        color="#1890ff"
        glowColor="#107667ed"
        className="w-full rounded-xl p-4"
      >
        <QrBarcodeScanner onScan={verifySerial} />
      </InteractiveGradient>

      {dialog.show && (
        <div
          className={`mt-6 p-4 rounded-xl shadow-lg text-center ${
            dialog.type === "success"
              ? "bg-green-600 text-white"
              : dialog.type === "error"
              ? "bg-red-600 text-white"
              : "bg-gray-800 text-white"
          }`}
        >
          <p className="text-lg font-bold">{dialog.message}</p>
          <button
            onClick={() =>
              setDialog({ show: false, message: "", type: "info" })
            }
            className="mt-3 bg-white text-black px-4 py-2 rounded"
          >
            OK
          </button>
        </div>
      )}
    </GridBackground>
  );
}

export default Verification;
