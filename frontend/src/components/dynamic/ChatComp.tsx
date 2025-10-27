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

import React, { useState, useRef } from "react";
import { GridBackground } from "../static/pages/CustomBack";
import type { Signer, Identifier } from "@xmtp/browser-sdk";
import { Client, ConsentState } from "@xmtp/browser-sdk";
import { ethers } from "ethers";

// Helper to clear XMTP IndexedDB
async function clearXmtpIndexedDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase("xmtp_db");
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
    request.onblocked = () =>
      reject(new Error("IndexedDB deletion blocked. Close other tabs."));
  });
}

const ChatComp: React.FC = () => {
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const isConnectingRef = useRef(false);

  const handleConnection = async (): Promise<void> => {
    if (isConnectingRef.current || xmtpClient) return;

    isConnectingRef.current = true;
    setConnectionError(null);

    try {
      if (!window.ethereum) {
        setConnectionError(
          "No Ethereum wallet detected. Please install MetaMask.",
        );
        isConnectingRef.current = false;
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const ethersSigner = await provider.getSigner();
      const accountAddress = await ethersSigner.getAddress();
      console.log(accountAddress);

      const accountIdentifier: Identifier = {
        identifier: accountAddress,
        identifierKind: "Ethereum",
      };

      const manualXmtpSigner: Signer = {
        type: "EOA",
        getIdentifier: () => accountIdentifier,
        signMessage: async (message: string): Promise<Uint8Array> => {
          const signature = await ethersSigner.signMessage(message);
          return new Uint8Array(
            signature
              .slice(2)
              .match(/.{1,2}/g)!
              .map((b) => parseInt(b, 16)),
          );
        },
      };

      const client = await Client.create(manualXmtpSigner, {
        env: "production",
      });
      setXmtpClient(client);

      // ✅ Wrap recipient wallet in Identifier
      const recipientIdentifier: Identifier = {
        identifier: "0xb72937218804cee992473d26283682b621fb7244", // recipient wallet
        identifierKind: "Ethereum",
      };

      const canMessage = await client.canMessage([recipientIdentifier]);
      // console.log(` Retreived Message :${canMessage}`);
      canMessage.forEach((value, key) => {
        console.log(`Address: ${key}, Can message: ${value}`);
      });

      if (!canMessage) {
        console.error("Recipient is not on XMTP network yet.");
        return;
      }

      const conversation =
        await client.conversations.newConversation(recipientIdentifier);
      await conversation.send("Hello 👋");
      await conversation.send("Dipesh here");

      const allowedConversations = await client.conversations.list({
        consentStates: [ConsentState.Allowed],
      });
      console.log("Allowed Conversations:", allowedConversations);
    } catch (error: any) {
      console.error("XMTP Connection Error:", error);
      setConnectionError(error.message);
    } finally {
      isConnectingRef.current = false;
    }
  };

  const handleClearLocalXmtpData = async () => {
    setConnectionError(null);
    try {
      await clearXmtpIndexedDB();
      setXmtpClient(null);
      alert("Local XMTP data cleared. Refresh or reconnect.");
    } catch (error: any) {
      setConnectionError(error.message);
    }
  };

  return (
    <GridBackground className="h-screen overflow-y-scroll md-hidden">
      <div className="bg-blue-600 p-4 rounded-xl text-white">
        <button
          onClick={handleConnection}
          disabled={isConnectingRef.current || !!xmtpClient}
        >
          {isConnectingRef.current
            ? "Connecting..."
            : xmtpClient
              ? "Connected"
              : "Connect Xmtp"}
        </button>
        {xmtpClient && (
          <div className="mt-2">
            <p>XMTP Client connected with address: {xmtpClient.address}</p>
            <button
              onClick={handleClearLocalXmtpData}
              className="mt-2 p-2 bg-yellow-500 hover:bg-yellow-600 rounded text-black"
            >
              Clear Local XMTP Data
            </button>
          </div>
        )}
        {connectionError && (
          <div className="text-red-500 mt-2 p-2 bg-red-100 rounded">
            {connectionError}
          </div>
        )}
      </div>
    </GridBackground>
  );
};

export default ChatComp;
