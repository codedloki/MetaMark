// barcodeZip.worker.js
import JSZip from 'jszip';

self.onmessage = async (e) => {
    const images = e.data; // array of { name: string, dataUrl: string }

    const zip = new JSZip();

    // Add each PNG (dataUrl) to zip as a file
    for (const { name, dataUrl } of images) {
        // Convert base64 dataUrl to binary
        const base64 = dataUrl.split(',')[1];
        zip.file(name, base64, { base64: true });
    }

    // Generate zip blob
    const content = await zip.generateAsync({ type: 'blob' });

    // Post zip blob back to main thread
    self.postMessage(content);
};
