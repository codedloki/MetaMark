/* 
import React, { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { GridBackground } from '../../static/pages/CustomBack';
import InteractiveGradient from '../../custom/InteractiveCard';
import {
  Html5QrcodeScanner,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScanType,
} from "html5-qrcode";

const QrBarcodeScanner = () => {
  useEffect(() => {
    const scannerConfig = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.EAN_13,
      ],
      showTorchButtonIfSupported: true,
    };

    const onScanSuccess = (decodedText, decodedResult) => {
      console.log("✅ Scanned:", decodedText);
      alert(`Scanned: ${decodedText}`);
    };

    const onScanFailure = (error) => {
      console.warn("❌ Scan error:", error);
    };

    const scanner = new Html5QrcodeScanner("scanner", scannerConfig, false);
    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch((error) => console.error("Clear error:", error));
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full px-4">
      <h1 className="font-bold mb-4 text-lg md:text-xl text-white">QR/Barcode Scanner</h1>
      <div id="scanner" className="w-full max-w-md rounded-lg overflow-hidden" />
    </div>
  );
};

function Verification() {
  return (
    <GridBackground className='px-4 pt-24 md:pt-64 mt-10 h-screen overflow-y-auto text-center items-center'>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-white text-3xl md:text-4xl font-bold text-center mb-10">Verification</h1>

        <div className="w-full flex justify-center pl-[5vh] mb-[2vh]" >
          <InteractiveGradient
            color="#1890ff"
            glowColor="#107667ed"
            followMouse={true}
            hoverOnly={false}
            intensity={100}
            backgroundColor="#151419"
            className="w-full md:w-3/4 lg:w-1/2 rounded-xl p-4 mb-5"
          >
            <QrBarcodeScanner />
          </InteractiveGradient>
        </div>
      </div>
    </GridBackground>
  );
}

export default Verification;

*/

import React, { useEffect, useRef, useState } from "react";
import { GridBackground } from "../../static/pages/CustomBack";
import InteractiveGradient from "../../custom/InteractiveCard";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
  Html5QrcodeScanType,
} from "html5-qrcode";

const QrBarcodeScanner = () => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = async () => {
    if (isScanning) return;
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      formatsToSupport: [
        Html5QrcodeSupportedFormats.QR_CODE,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.EAN_13,
      ],
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    };

    scannerRef.current = new Html5Qrcode("scanner");

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          console.log("✅ Scanned:", decodedText);
          alert(`Scanned: ${decodedText}`);
        },
        (error) => {
          console.warn("❌ Scan error:", error);
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error("Failed to start scanner:", err);
    }
  };

  const stopScanning = async () => {
    if (!scannerRef.current) return;
    try {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
      scannerRef.current = null;
      setIsScanning(false);
      console.log("Camera stopped successfully.");
    } catch (err) {
      console.error("Failed to stop scanner:", err);
    }
  };

  useEffect(() => {
    // Cleanup if component unmounts
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => { });
        scannerRef.current.clear().catch(() => { });
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full px-2 md:px-4">
      <h1 className="font-bold mb-4 text-lg md:text-xl text-white">
        QR / Barcode Scanner
      </h1>
      <div
        id="scanner"
        className="mt-[5vh] w-full  max-w-sm md:max-w-md rounded-lg overflow-hidden shadow-lg bg-black"
        style={{ height: "150px" }}
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={startScanning}
          className={`px-4 py-2 rounded-lg text-white ${isScanning ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
            }`}
          disabled={isScanning}
        >
          Start
        </button>
        <button
          onClick={stopScanning}
          className={`px-4 py-2 rounded-lg text-white ${!isScanning ? "bg-gray-500" : "bg-red-600 hover:bg-red-700"
            }`}
          disabled={!isScanning}
        >
          Stop
        </button>
      </div>
    </div>
  );
};

function Verification() {
  return (
    <GridBackground className="px-4 pt-20 md:pt-32 h-screen overflow-y-auto flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-white text-3xl md:text-4xl font-bold text-center mb-8">
          Verification
        </h1>

        <div className="w-full flex justify-center mb-6">
          <InteractiveGradient
            color="#1890ff"
            glowColor="#107667ed"
            followMouse={true}
            hoverOnly={false}
            intensity={100}
            backgroundColor="#151419"
            className="w-full sm:w-11/12 md:w-3/4 lg:w-[50vh] rounded-xl p-4 text-white"
          >
            <div className="p-4">
              <QrBarcodeScanner />
            </div>
          </InteractiveGradient>
        </div>
      </div>
    </GridBackground>
  );
}

export default Verification;

