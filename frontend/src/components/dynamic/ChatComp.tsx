import React from 'react';
import { GridBackground } from '../static/pages/CustomBack';
import type { Signer, Identifier } from '@xmtp/browser-sdk';
import { Client, ConsentState } from '@xmtp/browser-sdk';
import { Wallet } from 'ethers';
import { ethers } from 'ethers';

const ChatComp: React.FC = () => {
  const handleConnection = async (): Promise<void> => {
    try {
      console.log("Button Clicked");

      if (!window.ethereum) {
        console.error('No Ethereum wallet detected. Please install MetaMask.');
        return;
      }

      const wallet = Wallet.createRandom();
      console.log(wallet)
      console.log(wallet.address)
      const chatIdentifiers: Identifier[] = [
        { identifier: "0x0412d2f25be8cf3dc3b050744b7ec456f39c8593", identifierKind: "Ethereum" }
      ]

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

        // --- THE FIX IS HERE ---
        // Pass the entire signer OBJECT, not the result of calling a function on it.
        const client = await Client.create(manualXmtpSigner, { env: 'production' });
        console.log(client)
        const response = await client.canMessage(chatIdentifiers)
        console.log(response)
        const dm = await client.conversations.newDm('2f3ce1877808b1848c1604475be77e0cc10f75a1d5bdcd089e7e9559bc263f86')
        dm.send("Hello")
        dm.send("Dipesh here")

        const allowconversations = await client.conversations.list({ consentStates: [ConsentState.Allowed] })
        console.log("Allowed Conversations:", allowconversations)
      }
      catch (error) {
        console.log("Error Occured:", error)
      }

      // If you see this log, the client was created and the message was signed successfully.
      //      console.log("XMTP Client created successfully!", client);

      // --- SECONDARY FIX ---
      // The line below was using invalid addresses and would crash.
      // I have commented it out. To use it, you must provide a REAL Ethereum address.
      /*
      const validPeerAddress = "0x937C0d4a6294cdfa575de17382c7076b579DC176"; // Example valid address
      const canMessageResponse = await client.canMessage(validPeerAddress);
      console.log(`Can message ${validPeerAddress}?`, canMessageResponse);
      */

    } catch (error) {
      console.error("An error occurred during connection:", error);
    }
  };

  return (
    <GridBackground className="h-screen overflow-y-scroll md-hidden">
      <div className="bg-blue-600 p-4 rounded-xl text-white">
        <button onClick={handleConnection}>Connect Xmtp</button>
      </div>
    </GridBackground>
  );
};

export default ChatComp;
