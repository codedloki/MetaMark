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
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4 text-white">QR/Barcode Scanner</h1>
      <div id="scanner" className="w-full max-w-md rounded-lg overflow-hidden" />
    </div>
  );
};
function Verification() {




  return (
    <GridBackground className='pl-[30vh] md:pl-0 md:pt-64 mt-20 h-screen overflow-y-scroll'>
      <div>
        <h1 className="text-white text-4xl font-bold text-center mb-10">Verification</h1>

        <InteractiveGradient
          color="#1890ff"
          glowColor="#107667ed"
          followMouse={true}
          hoverOnly={false}
          intensity={100}
          backgroundColor="#151419"
          width="100vh"
          height="50vh"
          borderRadius="2.25rem"
          className="flex items-center justify-center"
        >
          {/* Barcode Output */}
          <QrBarcodeScanner/>
        </InteractiveGradient>
      </div>
    </GridBackground>
  );
}

export default Verification;
