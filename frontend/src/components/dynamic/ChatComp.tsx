// import React from 'react';
// import { GridBackground } from '../static/pages/CustomBack';
// import type { Signer, Identifier } from '@xmtp/browser-sdk';
// import { Client, ConsentState } from '@xmtp/browser-sdk';
// import { Wallet } from 'ethers';
// import { ethers } from 'ethers';

// const ChatComp: React.FC = () => {
//   const handleConnection = async (): Promise<void> => {
//     try {
//       console.log("Button Clicked");

//       if (!window.ethereum) {
//         console.error('No Ethereum wallet detected. Please install MetaMask.');
//         return;
//       }

//       const wallet = Wallet.createRandom();
//       console.log(wallet)
//       console.log(wallet.address)
//       const chatIdentifiers: Identifier[] = [
//         { identifier: "0x1adca7964a7d40fc48482c15164a60e20749fbcc", identifierKind: "Ethereum" }
//       ]

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const ethersSigner = await provider.getSigner();

//       const accountAddress = await ethersSigner.getAddress();

//       console.log("Wallet Connected, Address:", accountAddress);

//       const accountIdentifier: Identifier = {
//         identifier: accountAddress,
//         identifierKind: "Ethereum",
//       };

//       const manualXmtpSigner: Signer = {
//         type: "EOA",
//         getIdentifier: () => accountIdentifier,
//         signMessage: async (message: string): Promise<Uint8Array> => {
//           console.log("Requesting signature from wallet for message:", message);
//           const signature = await ethersSigner.signMessage(message);
//           console.log("Signature received:", signature);

//           const signatureBytes = new Uint8Array(
//             signature.slice(2).match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
//           );

//           return signatureBytes;
//         },
//       };


//       try {
//         console.log("Manual XMTP signer created. Calling Client.create() now...");

//         // --- THE FIX IS HERE ---
//         // Pass the entire signer OBJECT, not the result of calling a function on it.
//         const client = await Client.create(manualXmtpSigner, { env: 'production' });
//         console.log(client)
//         const response = await client.canMessage(chatIdentifiers)
//         console.log(response)
//         const dm = await client.conversations.newDm('0x1adca7964a7d40fc48482c15164a60e20749fbcc')
//         dm.send("Hello")
//         dm.send("Dipesh here")

//         const allowconversations = await client.conversations.list({ consentStates: [ConsentState.Allowed] })
//         console.log("Allowed Conversations:", allowconversations)
//       }
//       catch (error) {
//         console.error("Error Occured:", error)
//       }

//       // If you see this log, the client was created and the message was signed successfully.
//       //      console.log("XMTP Client created successfully!", client);

//       // --- SECONDARY FIX ---
//       // The line below was using invalid addresses and would crash.
//       // I have commented it out. To use it, you must provide a REAL Ethereum address.
//       /*
//       const validPeerAddress = "0x937C0d4a6294cdfa575de17382c7076b579DC176"; // Example valid address
//       const canMessageResponse = await client.canMessage(validPeerAddress);
//       console.log(`Can message ${validPeerAddress}?`, canMessageResponse);
//       */

//     } catch (error) {
//       console.error("An error occurred during connection:", error);
//     }
//   };

//   return (
//     <GridBackground className="h-screen overflow-y-scroll md-hidden">
//       <div className="bg-blue-600 p-4 rounded-xl text-white">
//         <button onClick={handleConnection}>Connect Xmtp</button>
//       </div>
//     </GridBackground>
//   );
// };

// export default ChatComp;


import React, { useState, useEffect, useRef } from 'react';
import { GridBackground } from '../static/pages/CustomBack';
import type { Signer, Identifier } from '@xmtp/browser-sdk';
import { Client, ConsentState } from '@xmtp/browser-sdk';
import { ethers } from 'ethers';

// Helper function to clear IndexedDB for XMTP
async function clearXmtpIndexedDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase('xmtp_db'); // This is the default name for browser-sdk
    request.onsuccess = () => {
      console.log("xmtp_db IndexedDB deleted successfully.");
      resolve();
    };
    request.onerror = (event) => {
      console.error("Error deleting xmtp_db IndexedDB:", event.target.error);
      reject(event.target.error);
    };
    request.onblocked = () => {
      console.warn("xmtp_db IndexedDB deletion blocked. Ensure all tabs are closed.");
      // Handle cases where other tabs might be holding a connection
      reject(new Error("IndexedDB deletion blocked. Close other tabs using this app."));
    };
  });
}


const ChatComp: React.FC = () => {
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const isConnectingRef = useRef(false);

  const handleConnection = async (): Promise<void> => {
    if (isConnectingRef.current || xmtpClient) {
      console.log("Already connecting or client already exists.");
      return;
    }

    isConnectingRef.current = true;
    setConnectionError(null);

    try {
      console.log("Button Clicked");

      if (!window.ethereum) {
        setConnectionError('No Ethereum wallet detected. Please install MetaMask.');
        isConnectingRef.current = false;
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const ethersSigner = await provider.getSigner();
      const accountAddress = await ethersSigner.getAddress();

      console.log("Wallet Connected, Address:", accountAddress);

      const accountIdentifier: Identifier = {
        identifier: accountAddress,
        identifierKind: "Ethereum",
      };

      const manualXmtpSigner: Signer = {
        type: "EOA",
        getIdentifier: () => accountIdentifier,
        signMessage: async (message: string): Promise<Uint8Array> => {
          console.log("Requesting signature from wallet for message:", message);
          const signature = await ethersSigner.signMessage(message);
          console.log("Signature received:", signature);

          const signatureBytes = new Uint8Array(
            signature.slice(2).match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
          );

          return signatureBytes;
        },
      };

      try {
        console.log("Manual XMTP signer created. Calling Client.create() now...");
        const client = await Client.create(manualXmtpSigner, { env: 'production' });
        setXmtpClient(client);
        console.log("XMTP Client created successfully!", client);

        const chatIdentifiers: Identifier[] = [
          { identifier: "0x1adca7964a7d40fc48482c15164a60e20749fbcc", identifierKind: "Ethereum" }
        ];

        const response = await client.canMessage(chatIdentifiers);
        console.log("Can message chatIdentifiers:", response);

        const dm = await client.conversations.newDm('0479daf2c7dfe16d4eff51b694efadac6934b02262bf4c57b7db31f915144d1f');
        dm.send("Hello");
        dm.send("Dipesh here");

        const allowedConversations = await client.conversations.list({ consentStates: [ConsentState.Allowed] });
        console.log("Allowed Conversations:", allowedConversations);

      } catch (error: any) {
        console.error("Error creating XMTP Client:", error);
        if (error.message && error.message.includes('Cannot register a new installation because the InboxID')) {
          setConnectionError(
            "XMTP Error: You have reached the maximum number of installations for this wallet. " +
            "Please try clearing local data, or manage installations via the XMTP Developer Console."
          );
        } else {
          setConnectionError(`An unexpected XMTP error occurred: ${error.message}`);
        }
      }

    } catch (error: any) {
      console.error("An error occurred during connection:", error);
      setConnectionError(`Connection failed: ${error.message}`);
    } finally {
      isConnectingRef.current = false;
    }
  };

  const handleClearLocalXmtpData = async () => {
    setConnectionError(null);
    try {
      await clearXmtpIndexedDB();
      setXmtpClient(null); // Reset client state
      console.log("Local XMTP data cleared. Please try connecting again.");
      alert("Local XMTP data cleared. You might need to refresh the page or reconnect.");
    } catch (error: any) {
      setConnectionError(`Failed to clear local XMTP data: ${error.message}`);
    }
  };


  return (
    <GridBackground className="h-screen overflow-y-scroll md-hidden">
      <div className="bg-blue-600 p-4 rounded-xl text-white">
        <button onClick={handleConnection} disabled={isConnectingRef.current || !!xmtpClient}>
          {isConnectingRef.current ? "Connecting..." : xmtpClient ? "Connected" : "Connect Xmtp"}
        </button>
        {xmtpClient && (
          <div className="mt-2">
            <p>XMTP Client connected with address: {xmtpClient.address}</p>
            <button
              onClick={handleClearLocalXmtpData}
              className="mt-2 p-2 bg-yellow-500 hover:bg-yellow-600 rounded text-black"
            >
              Clear Local XMTP Data (Soft Revoke)
            </button>
          </div>
        )}
        {connectionError && (
          <div className="text-red-500 mt-2 p-2 bg-red-100 rounded">
            <p>{connectionError}</p>
            {connectionError.includes("maximum number of installations") && (
              <p className="text-sm mt-1">
                Consider clearing local XMTP data (button above or manually via browser settings)
                or managing installations through the official{" "}
                <a href="https://xmtp.com/login" target="_blank" rel="noopener noreferrer" className="underline">
                  XMTP Developer Console
                </a>.
              </p>
            )}
          </div>
        )}
      </div>
    </GridBackground>
  );
};

export default ChatComp;