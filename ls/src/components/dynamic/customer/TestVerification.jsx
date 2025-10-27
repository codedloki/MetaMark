import React, { useState } from "react";
import bs58 from "bs58";

export default function BatchVerification() {
  const [barcodeValue, setBarcodeValue] = useState("");
  const [decodedData, setDecodedData] = useState(null);

  const handleDecodeBarcode = () => {
    try {
      const packed = bs58.decode(barcodeValue);

      const productId = packed.readUInt32BE(0);
      const batchId = packed.readUInt16BE(4);
      const serialId = packed.readUInt8(6);
      const hash = packed.slice(7).toString("hex");

      setDecodedData({ productId, batchId, serialId, hash });
    } catch (err) {
      console.error(err);
      setDecodedData(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold mb-6">🔍 Verify Barcode</h2>

      <input type="text" placeholder="Paste scanned barcode value" value={barcodeValue} onChange={(e) => setBarcodeValue(e.target.value)} className="border p-2 w-full max-w-lg rounded" />

      <button onClick={handleDecodeBarcode} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded">🔓 Decode Barcode</button>

      {decodedData && (
        <div className="mt-4 p-4 border rounded bg-gray-50 w-full max-w-lg">
          <p><strong>Product ID:</strong> {decodedData.productId}</p>
          <p><strong>Batch ID:</strong> {decodedData.batchId}</p>
          <p><strong>Serial ID:</strong> {decodedData.serialId}</p>
          <p><strong>Hash:</strong> {decodedData.hash}</p>
        </div>
      )}
    </div>
  );
}
