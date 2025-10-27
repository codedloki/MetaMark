// // import React, {
// //   useState,
// //   useRef,
// //   useEffect,
// //   ChangeEvent,
// //   KeyboardEvent,
// // } from "react";
// // import { Send } from "lucide-react";
// // import { ethers } from "ethers";
// // import {
// //   Client,
// //   ConsentState,
// //   type Signer,
// //   type Identifier,
// // } from "@xmtp/browser-sdk";

// // // 🌐 Helper to clear XMTP IndexedDB cache
// // async function clearXmtpIndexedDB(): Promise<void> {
// //   return new Promise((resolve, reject) => {
// //     const request = indexedDB.deleteDatabase("xmtp_db");
// //     request.onsuccess = () => resolve();
// //     request.onerror = (event) => reject((event.target as any).error);
// //     request.onblocked = () =>
// //       reject(new Error("IndexedDB deletion blocked. Close other tabs."));
// //   });
// // }

// // // ============================================
// // // 💬 Chat Interface + XMTP Integration
// // // ============================================

// // const ChatWindow: React.FC = () => {
// //   const [messages, setMessages] = useState<
// //     { sender: string; content: string }[]
// //   >([]);
// //   const [newMessage, setNewMessage] = useState("");
// //   const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
// //   const [connectionError, setConnectionError] = useState<string | null>(null);
// //   const [isConnecting, setIsConnecting] = useState(false);
// //   const messagesEndRef = useRef<HTMLDivElement | null>(null);

// //   // Recipient wallet (replace with a real XMTP-enabled wallet)
// //   const recipientWallet = "0xb72937218804cee992473d26283682b621fb7244";

// //   // Scroll to latest message
// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   // Connect to XMTP
// //   const handleConnection = async (): Promise<void> => {
// //     if (isConnecting || xmtpClient) return;
// //     setIsConnecting(true);
// //     setConnectionError(null);

// //     try {
// //       if (!window.ethereum) {
// //         setConnectionError("MetaMask not detected. Please install it first.");
// //         return;
// //       }

// //       const provider = new ethers.BrowserProvider(window.ethereum);
// //       const signer = await provider.getSigner();
// //       const accountAddress = await signer.getAddress();
// //       console.log("Connected wallet:", accountAddress);

// //       const accountIdentifier: Identifier = {
// //         identifier: accountAddress,
// //         identifierKind: "Ethereum",
// //       };

// //       const manualSigner: Signer = {
// //         type: "EOA",
// //         getIdentifier: () => accountIdentifier,
// //         signMessage: async (message: string): Promise<Uint8Array> => {
// //           const signature = await signer.signMessage(message);
// //           return new Uint8Array(
// //             signature
// //               .slice(2)
// //               .match(/.{1,2}/g)!
// //               .map((b) => parseInt(b, 16)),
// //           );
// //         },
// //       };

// //       // ✅ Create XMTP client
// //       const client = await Client.create(manualSigner, { env: "production" });
// //       setXmtpClient(client);
// //       console.log("XMTP Client created ✅");

// //       // ✅ Test if recipient is on XMTP
// //       const recipientIdentifier: Identifier = {
// //         identifier: recipientWallet,
// //         identifierKind: "Ethereum",
// //       };

// //       const canMessage = await client.canMessage([recipientIdentifier]);
// //       const canMsgValue = canMessage.get(recipientWallet);
// //       console.log(`Can message ${recipientWallet}?`, canMsgValue);

// //       if (!canMsgValue) {
// //         setConnectionError("Recipient is not registered on XMTP.");
// //         return;
// //       }

// //       // Send initial message
// //       const conversation =
// //         await client.conversations.newDm(recipientIdentifier);
// //       await conversation.send("Hello 👋");
// //       setMessages((prev) => [...prev, { sender: "You", content: "Hello 👋" }]);

// //       const allowedConversations = await client.conversations.list({
// //         consentStates: [ConsentState.Allowed],
// //       });
// //       console.log("Allowed conversations:", allowedConversations);
// //     } catch (error: any) {
// //       console.error("XMTP Error:", error);
// //       setConnectionError(error.message || "Connection failed.");
// //     } finally {
// //       setIsConnecting(false);
// //     }
// //   };

// //   // Send Message
// //   const sendMessage = async (): Promise<void> => {
// //     if (!xmtpClient || !newMessage.trim()) return;

// //     const recipientIdentifier: Identifier = {
// //       identifier: recipientWallet,
// //       identifierKind: "Ethereum",
// //     };

// //     try {
// //       const conversation =
// //         await xmtpClient.conversations.newDm(recipientIdentifier);
// //       await conversation.send(newMessage.trim());
// //       console.log("Message sent:", newMessage);

// //       setMessages((prev) => [
// //         ...prev,
// //         { sender: "You", content: newMessage.trim() },
// //       ]);
// //       setNewMessage("");
// //     } catch (error: any) {
// //       console.error("Failed to send message:", error);
// //       setConnectionError(error.message);
// //     }
// //   };

// //   // Handle Enter press
// //   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
// //     if (e.key === "Enter") sendMessage();
// //   };

// //   // Clear XMTP Data
// //   const handleClearLocalXmtpData = async () => {
// //     try {
// //       await clearXmtpIndexedDB();
// //       setXmtpClient(null);
// //       alert("Local XMTP data cleared. Refresh or reconnect.");
// //     } catch (error: any) {
// //       setConnectionError(error.message);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
// //       {/* Top Bar */}
// //       <div className="flex items-center justify-between mb-4">
// //         <h1 className="text-lg font-bold">XMTP Chat</h1>
// //         <button
// //           onClick={handleConnection}
// //           disabled={isConnecting || !!xmtpClient}
// //           className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
// //         >
// //           {isConnecting
// //             ? "Connecting..."
// //             : xmtpClient
// //               ? "Connected ✅"
// //               : "Connect XMTP"}
// //         </button>
// //       </div>

// //       {/* Message Area */}
// //       <div className="flex-1 overflow-y-auto bg-gray-800 p-3 rounded-lg">
// //         {messages.map((msg, idx) => (
// //           <div
// //             key={idx}
// //             className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"} mb-2`}
// //           >
// //             <div
// //               className={`p-2 rounded-xl max-w-xs ${
// //                 msg.sender === "You"
// //                   ? "bg-green-600 text-white"
// //                   : "bg-gray-300 text-black"
// //               }`}
// //             >
// //               <p className="text-sm">{msg.content}</p>
// //             </div>
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Input Bar */}
// //       <div className="mt-3 flex items-center bg-gray-700 rounded-lg p-2">
// //         <input
// //           type="text"
// //           className="flex-1 bg-transparent text-white outline-none px-2"
// //           placeholder="Type your message..."
// //           value={newMessage}
// //           onChange={(e: ChangeEvent<HTMLInputElement>) =>
// //             setNewMessage(e.target.value)
// //           }
// //           onKeyDown={handleKeyDown}
// //         />
// //         <button
// //           onClick={sendMessage}
// //           className="ml-2 p-2 bg-blue-500 rounded-lg hover:bg-blue-600"
// //         >
// //           <Send size={20} />
// //         </button>
// //       </div>

// //       {/* Error + Tools */}
// //       {connectionError && (
// //         <div className="mt-3 bg-red-500 text-white p-2 rounded">
// //           {connectionError}
// //         </div>
// //       )}
// //       {xmtpClient && (
// //         <button
// //           onClick={handleClearLocalXmtpData}
// //           className="mt-3 bg-yellow-500 text-black p-2 rounded"
// //         >
// //           Clear XMTP Cache
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChatWindow;
// // import React, {
// //   useState,
// //   useRef,
// //   useEffect,
// //   ChangeEvent,
// //   KeyboardEvent,
// // } from "react";
// // import { Send } from "lucide-react";
// // import { ethers } from "ethers";
// // import {
// //   Client,
// //   ConsentState,
// //   type Signer,
// //   type Identifier,
// // } from "@xmtp/browser-sdk";

// // // 🌐 Helper to clear XMTP IndexedDB cache
// // async function clearXmtpIndexedDB(): Promise<void> {
// //   return new Promise((resolve, reject) => {
// //     const request = indexedDB.deleteDatabase("xmtp_db");
// //     request.onsuccess = () => resolve();
// //     request.onerror = (event) => reject((event.target as any).error);
// //     request.onblocked = () =>
// //       reject(new Error("IndexedDB deletion blocked. Close other tabs."));
// //   });
// // }

// // // ✅ Utility: Convert hex signature string to Uint8Array
// // function hexToUint8Array(hex: string): Uint8Array {
// //   if (hex.startsWith("0x")) hex = hex.slice(2);
// //   return new Uint8Array(hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
// // }

// // const ChatWindow: React.FC = () => {
// //   const [messages, setMessages] = useState<
// //     { sender: string; content: string }[]
// //   >([]);
// //   const [newMessage, setNewMessage] = useState("");
// //   const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
// //   const [connectionError, setConnectionError] = useState<string | null>(null);
// //   const [isConnecting, setIsConnecting] = useState(false);
// //   const messagesEndRef = useRef<HTMLDivElement | null>(null);

// //   const recipientWallet = "0x242f10bd5b6f95bb7f1d53b727c199e2e96e9c9f";

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   const handleConnection = async (): Promise<void> => {
// //     if (isConnecting || xmtpClient) return;
// //     setIsConnecting(true);
// //     setConnectionError(null);

// //     try {
// //       if (!window.ethereum) {
// //         setConnectionError("MetaMask not detected. Please install it first.");
// //         return;
// //       }

// //       const provider = new ethers.BrowserProvider(window.ethereum);
// //       const signer = await provider.getSigner();
// //       const address = await signer.getAddress();
// //       console.log("Connected wallet:", address);
// //       console.log(typeof address);

// //       // ✅ Create a XMTP-compatible Signer adapter for ethers v6
// //       const xmtpSigner: Signer = {
// //         type: "EOA",
// //         getIdentifier: async (): Promise<Identifier> => ({
// //           identifier: address,
// //           identifierKind: "Ethereum",
// //         }),
// //         signMessage: async (message: string): Promise<Uint8Array> => {
// //           const signature = await signer.signMessage(message);
// //           return hexToUint8Array(signature);
// //         },
// //       };

// //       // ✅ Create XMTP client using wrapped signer
// //       const client = await Client.create(xmtpSigner, { env: "production" });
// //       setXmtpClient(client);
// //       console.log("XMTP client created ✅");

// //       // ✅ Check if recipient can receive messages
// //       const canMessageMap = await client.canMessage([recipientWallet]);
// //       const canMessage = canMessageMap.get(recipientWallet);
// //       console.log("Can message?", canMessage);

// //       if (!canMessage) {
// //         setConnectionError("Recipient is not registered on XMTP.");
// //         return;
// //       }

// //       // ✅ Create conversation & send a message
// //       const conversation = await client.conversations.newDm(recipientWallet);
// //       const msg = await conversation.send("Hello 👋");
// //       console.log(msg);
// //       setMessages((prev) => [...prev, { sender: "You", content: "Hello 👋" }]);

// //       // ✅ Show allowed conversations
// //       const allowed = await client.conversations.list({
// //         consentStates: [ConsentState.Allowed],
// //       });
// //       console.log("Allowed conversations:", allowed);
// //     } catch (err: any) {
// //       console.error("XMTP Error:", err);
// //       setConnectionError(err.message || "Connection failed.");
// //     } finally {
// //       setIsConnecting(false);
// //     }
// //   };

// //   const sendMessage = async (): Promise<void> => {
// //     if (!xmtpClient || !newMessage.trim()) return;
// //     try {
// //       const convo = await xmtpClient.conversations.newDm(recipientWallet);
// //       await convo.send(newMessage.trim());
// //       setMessages((prev) => [
// //         ...prev,
// //         { sender: "You", content: newMessage.trim() },
// //       ]);
// //       setNewMessage("");
// //     } catch (err: any) {
// //       console.error("Send error:", err);
// //       setConnectionError(err.message);
// //     }
// //   };

// //   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
// //     if (e.key === "Enter") sendMessage();
// //   };

// //   const handleClearLocalXmtpData = async () => {
// //     try {
// //       await clearXmtpIndexedDB();
// //       setXmtpClient(null);
// //       alert("XMTP cache cleared ✅");
// //     } catch (err: any) {
// //       setConnectionError(err.message);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
// //       {/* Header */}
// //       <div className="flex items-center justify-between mb-4">
// //         <h1 className="text-lg font-bold">XMTP Chat</h1>
// //         <button
// //           onClick={handleConnection}
// //           disabled={isConnecting || !!xmtpClient}
// //           className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
// //         >
// //           {isConnecting
// //             ? "Connecting..."
// //             : xmtpClient
// //               ? "Connected ✅"
// //               : "Connect XMTP"}
// //         </button>
// //       </div>

// //       {/* Chat Area */}
// //       <div className="flex-1 overflow-y-auto bg-gray-800 p-3 rounded-lg">
// //         {messages.map((msg, i) => (
// //           <div
// //             key={i}
// //             className={`flex ${
// //               msg.sender === "You" ? "justify-end" : "justify-start"
// //             } mb-2`}
// //           >
// //             <div
// //               className={`p-2 rounded-xl max-w-xs ${
// //                 msg.sender === "You"
// //                   ? "bg-green-600 text-white"
// //                   : "bg-gray-300 text-black"
// //               }`}
// //             >
// //               <p className="text-sm">{msg.content}</p>
// //             </div>
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Input */}
// //       <div className="mt-3 flex items-center bg-gray-700 rounded-lg p-2">
// //         <input
// //           type="text"
// //           className="flex-1 bg-transparent text-white outline-none px-2"
// //           placeholder="Type your message..."
// //           value={newMessage}
// //           onChange={(e: ChangeEvent<HTMLInputElement>) =>
// //             setNewMessage(e.target.value)
// //           }
// //           onKeyDown={handleKeyDown}
// //         />
// //         <button
// //           onClick={sendMessage}
// //           className="ml-2 p-2 bg-blue-500 rounded-lg hover:bg-blue-600"
// //         >
// //           <Send size={20} />
// //         </button>
// //       </div>

// //       {/* Error + Tools */}
// //       {connectionError && (
// //         <div className="mt-3 bg-red-500 text-white p-2 rounded">
// //           {connectionError}
// //         </div>
// //       )}
// //       {xmtpClient && (
// //         <button
// //           onClick={handleClearLocalXmtpData}
// //           className="mt-3 bg-yellow-500 text-black p-2 rounded"
// //         >
// //           Clear XMTP Cache
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChatWindow;
// // import React, {
// //   useState,
// //   useRef,
// //   useEffect,
// //   ChangeEvent,
// //   KeyboardEvent,
// // } from "react";
// // import { Send } from "lucide-react";
// // import { ethers } from "ethers";
// // import {
// //   Client,
// //   ConsentState,
// //   type Signer,
// //   type Identifier,
  
// // } from "@xmtp/browser-sdk";


// // // 🌐 Clear XMTP cache
// // async function clearXmtpIndexedDB(): Promise<void> {
// //   return new Promise((resolve, reject) => {
// //     const request = indexedDB.deleteDatabase("xmtp_db");
// //     request.onsuccess = () => resolve();
// //     request.onerror = (event) => reject((event.target as any).error);
// //     request.onblocked = () =>
// //       reject(new Error("IndexedDB deletion blocked. Close other tabs."));
// //   });
// // }

// // // 🧰 Utility: convert hex signature string → Uint8Array
// // function hexToUint8Array(hex: string): Uint8Array {
// //   if (hex.startsWith("0x")) hex = hex.slice(2);
// //   return new Uint8Array(hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)));
// // }

// // // 🧰 Utility: sanitize identifier (for XMTP’s internal DB)
// // function sanitizeIdentifier(id: string): string {
// //   // Ethereum addresses: keep 0x, but lowercase
// //   if (/^0x[a-fA-F0-9]{40}$/.test(id)) return id.toLowerCase();
// //   // XMTP inbox IDs or internal hex: remove 0x
// //   return id.replace(/^0x/, "");
// // }

// // const ChatWindow: React.FC = () => {
// //   const [messages, setMessages] = useState<
// //     { sender: string; content: string }[]
// //   >([]);
// //   const [inboxid,setinboxid] = useState('')
// //   const [newMessage, setNewMessage] = useState("");
// //   const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
// //   const [connectionError, setConnectionError] = useState<string | null>(null);
// //   const [isConnecting, setIsConnecting] = useState(false);
// //   const messagesEndRef = useRef<HTMLDivElement | null>(null);

// //   // const recipientWallet = "0x242f10bd5b6f95bb7f1d53b727c199e2e96e9c9f";
// //   const identifiers: Identifier[] = [
// //     {
// //       identifier: "0x242f10bd5b6f95bb7f1d53b727c199e2e96e9c9f",
// //       identifierKind: "Ethereum",
// //     },
// //   ];

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);

// //   const handleConnection = async (): Promise<void> => {
// //     if (isConnecting || xmtpClient) return;
// //     setIsConnecting(true);
// //     setConnectionError(null);

// //     try {
// //       if (!window.ethereum) {
// //         setConnectionError("MetaMask not detected. Please install it first.");
// //         return;
// //       }

// //       const provider = new ethers.BrowserProvider(window.ethereum);
// //       const signer = await provider.getSigner();
// //       const address = await signer.getAddress();
// //       console.log("Connected wallet:", address);

// //       const accountIdentifier: Identifier = {
// //         identifier: address, // Ethereum address as the identifier
// //         identifierKind: "Ethereum", // Specifies the identity type
// //       };
// //       // ✅ Wrap ethers signer for XMTP
// //       const xmtpSigner: Signer = {
// //         type: "EOA",
// //         getIdentifier: () => accountIdentifier,
// //         signMessage: async (message: string): Promise<Uint8Array> => {
// //           const signature = await signer.signMessage(message);
// //           return hexToUint8Array(signature);
// //         },
// //       };

// //       // ✅ Create XMTP client (use "dev" or "production")
// //       const client = await Client.create(xmtpSigner, { env: "dev" });
// //       setXmtpClient(client);
// //       console.log("XMTP client created ✅");
// //       // const inboxId = await client.getInboxIdFromAddress(
// //       //   identifiers[0].identifier,

// //       function replacer(key: any, value: any) {
// //   // Check if value is a BigInt and convert it to a string for serialization
// //   if (typeof value === 'bigint') {
// //     return value.toString();
// //   }
// //   return value;
// // }
// //       // );
// //       // console.log("Inbox ID:", inboxId);

// //       // ✅ Check if recipient can receive messages
// //       // const recipient = sanitizeIdentifier(identifiers);
// //       const response = await client.canMessage(identifiers);
// //       // const canMsg = canMsgMap.get(identifiers);
// //       console.log(`Can message ${identifiers}?`, response);
// //       // const inboid = await client.getInboxId(address)
// //       // console.log(`Inbox id : ${inboid}`)
// //       const inboxstate = await client.preferences.inboxState(identifiers);
// //       console.log(`Inbox Id :${inboxstate.inboxId}`)
// //       setinboxid(inboxstate.inboxId)
// //       console.log(`Inbox State :${JSON.stringify(inboxstate, replacer, 2)}`)


// //       if (!response) {
// //         setConnectionError("Recipient is not registered on XMTP.");
// //         return;
// //       }

// //       // ✅ Create DM and send a message


// //       const convo = await client.conversations.newDm("0x242f10bd5b6f95bb7f1d53b727c199e2e96e9c9f");
// //       const peerInboxId = await convo.peerInboxId();
// //       console.log( "Peer Inbox Id",peerInboxId)
// //       await convo.send("Hello 👋");
// //       setMessages((prev) => [...prev, { sender: "You", content: "Hello 👋" }]);

// //       const allowedConvos = await client.conversations.list({
// //         consentStates: [ConsentState.Allowed],
// //       });
// //       console.log("Allowed conversations:", allowedConvos);
// //     } catch (err: any) {
// //       console.error("XMTP Error:", err);
// //       setConnectionError(err.message || "Connection failed.");
// //     } finally {
// //       setIsConnecting(false);
// //     }
// //   };

// //   const sendMessage = async (): Promise<void> => {
// //     if (!xmtpClient || !newMessage.trim()) return;
// //     try {
// //       const recipient = sanitizeIdentifier(identifiers[0].identifier);
// //       const convo = await xmtpClient.conversations.newDm("4bce1c6ae10f9b077dd33b406a07b95897e41350fc728f4e39504e50a370a452");
// //       await convo.send(newMessage.trim());
// //       setMessages((prev) => [
// //         ...prev,
// //         { sender: "You", content: newMessage.trim() },
// //       ]);
// //       setNewMessage("");
// //     } catch (err: any) {
// //       console.error("Send error:", err);
// //       setConnectionError(err.message);
// //     }
// //   };

// //   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
// //     if (e.key === "Enter") sendMessage();
// //   };

// //   const handleClearLocalXmtpData = async () => {
// //     try {
// //       await clearXmtpIndexedDB();
// //       setXmtpClient(null);
// //       alert("XMTP cache cleared ✅");
// //     } catch (err: any) {
// //       setConnectionError(err.message);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col h-screen bg-gray-900 teDxt-white p-4">
// //       {/* Header */}
// //       <div className="flex items-center justify-between mb-4">
// //         <h1 className="text-lg font-bold">XMTP Chat</h1>
// //         <button
// //           onClick={handleConnection}
// //           disabled={isConnecting || !!xmtpClient}
// //           className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
// //         >
// //           {isConnecting
// //             ? "Connecting..."
// //             : xmtpClient
// //               ? "Connected ✅"
// //               : "Connect XMTP"}
// //         </button>
// //       </div>

// //       {/* Chat Area */}
// //       <div className="flex-1 overflow-y-auto bg-gray-800 p-3 rounded-lg">
// //         {messages.map((msg, i) => (
// //           <div
// //             key={i}
// //             className={`flex ${
// //               msg.sender === "You" ? "justify-end" : "justify-start"
// //             } mb-2`}
// //           >
// //             <div
// //               className={`p-2 rounded-xl max-w-xs ${
// //                 msg.sender === "You"
// //                   ? "bg-green-600 text-white"
// //                   : "bg-gray-300 text-black"
// //               }`}
// //             >
// //               <p className="text-sm">{msg.content}</p>
// //             </div>
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Input */}
// //       <div className="mt-3 flex items-center bg-gray-700 rounded-lg p-2">
// //         <input
// //           type="text"
// //           className="flex-1 bg-transparent text-white outline-none px-2"
// //           placeholder="Type your message..."
// //           value={newMessage}
// //           onChange={(e: ChangeEvent<HTMLInputElement>) =>
// //             setNewMessage(e.target.value)
// //           }
// //           onKeyDown={handleKeyDown}
// //         />
// //         <button
// //           onClick={sendMessage}
// //           className="ml-2 p-2 bg-blue-500 rounded-lg hover:bg-blue-600"
// //         >D
// //           <Send size={20} />
// //         </button>
// //       </div>

// //       {/* Error + Tools */}
// //       {connectionError && (
// //         <div className="mt-3 bg-red-500 text-white p-2 rounded">
// //           {connectionError}
// //         </div>
// //       )}
// //       {xmtpClient && (
// //         <button
// //           onClick={handleClearLocalXmtpData}
// //           className="mt-3 bg-yellow-500 text-black p-2 rounded"
// //         >
// //           Clear XMTP Cache
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChatWindow;
// // import React, {
// //   useState,
// //   useRef,
// //   useEffect,
// //   ChangeEvent,
// //   KeyboardEvent,
// // } from "react";
// // import { Send } from "lucide-react";
// // import { ethers } from "ethers";
// // import {
// //   Client,
// //   ConsentState,
// //   type Signer,
// //   type Identifier,
// // } from "@xmtp/browser-sdk";


// // // 🌐 Helper to clear XMTP IndexedDB cache
// // async function clearXmtpIndexedDB(): Promise<void> {
// //   return new Promise((resolve, reject) => {
// //     const request = indexedDB.deleteDatabase("xmtp_db");
// //     request.onsuccess = () => resolve();
// //     request.onerror = (event) => reject((event.target as any).error);
// //     request.onblocked = () =>
// //       reject(new Error("IndexedDB deletion blocked. Close other tabs."));
// //   });
// // }

// // // 🧰 Utility: convert hex signature string → Uint8Array
// // function hexToUint8Array(hex: string): Uint8Array {
// //   if (hex.startsWith("0x")) hex = hex.slice(2);
// //   const match = hex.match(/.{1,2}/g);
// //   if (!match) return new Uint8Array();
// //   return new Uint8Array(match.map((b) => parseInt(b, 16)));
// // }

// // // 🧰 Utility: Custom JSON replacer to handle BigInt
// // function replacer(key: any, value: any) {
// //   if (typeof value === 'bigint') {
// //     return value.toString();
// //   }
// //   return value;
// // }

// // const ChatWindow: React.FC = () => {
// //   const [messages, setMessages] = useState<
// //     { sender: string; content: string }[]
// //   >([]);
// //   // 🛑 Removed: const [inboxid, setinboxid] = useState(''); // State variable for YOUR inbox ID is unnecessary
// //   const [newMessage, setNewMessage] = useState("");
// //   const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
// //   const [connectionError, setConnectionError] = useState<string | null>(null);
// //   const [isConnecting, setIsConnecting] = useState(false);
// //   const messagesEndRef = useRef<HTMLDivElement | null>(null);

// //   // ✅ Recipient Wallet address is used consistently
// //   const recipientWallet = "0x242f10bd5b6f95bb7f1d53b727c199e2e96e9c9f";
// //   const recipientIdentifier: Identifier[] = [
// //     {
// //       identifier: recipientWallet,
// //       identifierKind: "Ethereum",
// //     },
// //   ];

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);


// //   const handleConnection = async (): Promise<void> => {
// //     if (isConnecting || xmtpClient) return;
// //     setIsConnecting(true);
// //     setConnectionError(null);

// //     try {
// //       if (!window.ethereum) {
// //         setConnectionError("MetaMask not detected. Please install it first.");
// //         return;
// //       }

// //       const provider = new ethers.BrowserProvider(window.ethereum);
// //       const signer = await provider.getSigner();
// //       const address = await signer.getAddress();
// //       console.log("Connected wallet:", address);

// //       const accountIdentifier: Identifier = {
// //         identifier: address,
// //         identifierKind: "Ethereum",
// //       };
      
// //       const xmtpSigner: Signer = {
// //         type: "EOA",
// //         getIdentifier: () => accountIdentifier,
// //         signMessage: async (message: string): Promise<Uint8Array> => {
// //           const signature = await signer.signMessage(message);
// //           return hexToUint8Array(signature);
// //         },
// //       };

// //       // ✅ Using 'dev' environment
// //       const client = await Client.create(xmtpSigner, { env: "dev" });
// //       setXmtpClient(client);
// //       console.log("XMTP client created ✅");
// //       const stream = await client.conversations.streamAllMessages({
// //   consentStates: [ConsentState.Allowed],
// //   onValue: (message) => {
// //     // Received a message
// //     console.log('New message:', message);
// //   },
// //   onError: (error) => {
// //     // Log any stream errors
// //     console.error(error);
// //   },
// //   onFail: () => {
// //     console.log('Stream failed');
// //   },
// // });
 
// // // Or use for-await loop
// // for await (const message of stream) {
// //   // Received a message
// //   console.log('New message:', message);
// // } 
      
// //       // ✅ Check if recipient can receive messages
// //       const canMessageMap = await client.canMessage(recipientIdentifier);
// //       console.log(`can mesahe : ${canMessageMap}`)
// //       const canMessage = canMessageMap.get(recipientWallet);
// //       console.log(`Can message ${recipientWallet}?`, canMessage);
      
// //       // ✅ FIX 2: Called without arguments
// //       const inboxstate = await client.preferences.inboxState(); 
// //       console.log(`My Inbox Id :${inboxstate.inboxId}`);
// //       console.log(`Inbox State :${JSON.stringify(inboxstate, replacer, 2)}`);

// //       if (!canMessage) {
// //         setConnectionError("Recipient is not registered on XMTP.");
// //         return;
// //       }

// //       // ✅ Use recipientWallet consistently
// //       const convo = await client.conversations.newDm(recipientWallet); 
      
// //       // PeerInboxId is useful for debugging/display, but not essential for send
// //       const peerInboxId = await convo.peerInboxId();
// //       console.log( "Peer Inbox Id", peerInboxId); 
      
// //       await convo.send("Hello 👋");
// //       setMessages((prev) => [...prev, { sender: "You", content: "Hello 👋" }]);

// //       const allowedConvos = await client.conversations.list({
// //         consentStates: [ConsentState.Allowed],
// //       });
// //       console.log("Allowed conversations:", allowedConvos);
// //       // streamAllMessages(convo)
// //     } catch (err: any) {
// //       console.error("XMTP Error:", err);
// //       setConnectionError(err.message || "Connection failed.");
// //     } finally {
// //       setIsConnecting(false);
// //     }
// //   };

// //   const sendMessage = async (): Promise<void> => {
// //     if (!xmtpClient || !newMessage.trim()) return;
// //     try {
// //       // 🛑 FIX 1: New messages must be sent to the recipient, not the sender's own Inbox ID.
// //       const convo = await xmtpClient.conversations.newDm("858a4348f664e57c7b1ce19ce4ab01eaee9e18c072b97dfe95f705d69cc3d207"); 
      
// //       await convo.send(newMessage.trim());
// //       setMessages((prev) => [
// //         ...prev,
// //         { sender: "You", content: newMessage.trim() },
// //       ]);
// //       setNewMessage("");
// //     } catch (err: any) {
// //       console.error("Send error:", err);
// //       setConnectionError(err.message);
// //     }
// //   };

// //   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
// //     if (e.key === "Enter") sendMessage();
// //   };

// //   const handleClearLocalXmtpData = async () => {
// //     try {
// //       await clearXmtpIndexedDB();
// //       setXmtpClient(null);
// //       alert("XMTP cache cleared ✅");
// //     } catch (err: any) {
// //       setConnectionError(err.message);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
// //       {/* Header */}
// //       <div className="flex items-center justify-between mb-4">
// //         <h1 className="text-lg font-bold">XMTP Chat</h1>
// //         <button
// //           onClick={handleConnection}
// //           disabled={isConnecting || !!xmtpClient}
// //           className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
// //         >
// //           {isConnecting
// //             ? "Connecting..."
// //             : xmtpClient
// //             ? "Connected ✅"
// //             : "Connect XMTP"}
// //         </button>
// //       </div>

// //       {/* Chat Area */}
// //       <div className="flex-1 overflow-y-auto bg-gray-800 p-3 rounded-lg">
// //         {messages.map((msg, i) => (
// //           <div
// //             key={i}
// //             className={`flex ${
// //               msg.sender === "You" ? "justify-end" : "justify-start"
// //             } mb-2`}
// //           >
// //             <div
// //               className={`p-2 rounded-xl max-w-xs ${
// //                 msg.sender === "You"
// //                   ? "bg-green-600 text-white"
// //                   : "bg-gray-300 text-black"
// //               }`}
// //             >
// //               <p className="text-sm">{msg.content}</p>
// //             </div>
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Input */}
// //       <div className="mt-3 flex items-center bg-gray-700 rounded-lg p-2">
// //         <input
// //           type="text"
// //           className="flex-1 bg-transparent text-white outline-none px-2"
// //           placeholder="Type your message..."
// //           value={newMessage}
// //           onChange={(e: ChangeEvent<HTMLInputElement>) =>
// //             setNewMessage(e.target.value)
// //           }
// //           onKeyDown={handleKeyDown}
// //         />
// //         <button
// //           onClick={sendMessage}
// //           className="ml-2 p-2 bg-blue-500 rounded-lg hover:bg-blue-600"
// //         >
// //           <Send size={20} />
// //         </button>
// //       </div>

// //       {/* Error + Tools */}
// //       {connectionError && (
// //         <div className="mt-3 bg-red-500 text-white p-2 rounded">
// //           {connectionError}
// //         </div>
// //       )}
// //       {xmtpClient && (
// //         <button
// //           onClick={handleClearLocalXmtpData}
// //           className="mt-3 bg-yellow-500 text-black p-2 rounded"
// //         >
// //           Clear XMTP Cache
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChatWindow;


// // import React, {
// //   useState,
// //   useRef,
// //   useEffect,
// //   ChangeEvent,
// //   KeyboardEvent,
// // } from "react";
// // import { Send } from "lucide-react";
// // import { ethers } from "ethers";
// // import {
// //   Client,
// //   ConsentState,
// //   type Signer,
// //   type Identifier,
// // } from "@xmtp/browser-sdk";


// // // 🌐 Helper to clear XMTP IndexedDB cache
// // async function clearXmtpIndexedDB(): Promise<void> {
// //   return new Promise((resolve, reject) => {
// //     const request = indexedDB.deleteDatabase("xmtp_db");
// //     request.onsuccess = () => resolve();
// //     request.onerror = (event) => reject((event.target as any).error);
// //     request.onblocked = () =>
// //       reject(new Error("IndexedDB deletion blocked. Close other tabs."));
// //   });
// // }

// // // 🧰 Utility: convert hex signature string → Uint8Array
// // function hexToUint8Array(hex: string): Uint8Array {
// //   if (hex.startsWith("0x")) hex = hex.slice(2);
// //   const match = hex.match(/.{1,2}/g);
// //   if (!match) return new Uint8Array();
// //   return new Uint8Array(match.map((b) => parseInt(b, 16)));
// // }

// // // ✅ FIX: Custom JSON replacer to handle BigInt (Correctly defined here)
// // function replacer(key: any, value: any) {
// //   if (typeof value === 'bigint') {
// //     return value.toString(); // Convert BigInt to string before serialization
// //   }
// //   return value;
// // }

// // const ChatWindow: React.FC = () => {
// //   const [messages, setMessages] = useState<
// //     { sender: string; content: string }[]
// //   >([]);
// //   
// //   const [newMessage, setNewMessage] = useState("");
// //   const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
// //   const [connectionError, setConnectionError] = useState<string | null>(null);
// //   const [isConnecting, setIsConnecting] = useState(false);
// //   const messagesEndRef = useRef<HTMLDivElement | null>(null);

// //   // ✅ Recipient Wallet address is used consistently
// //   const recipientWallet = "0x242f10bd5b6f95bb7f1d53b727c199e2e96e9c9f";
// //   const recipientIdentifier: Identifier[] = [
// //     {
// //       identifier: recipientWallet,
// //       identifierKind: "Ethereum",
// //     },
// //   ];

// //   useEffect(() => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   }, [messages]);


// //   const handleConnection = async (): Promise<void> => {
// //     if (isConnecting || xmtpClient) return;
// //     setIsConnecting(true);
// //     setConnectionError(null);

// //     try {
// //       if (!window.ethereum) {
// //         setConnectionError("MetaMask not detected. Please install it first.");
// //         return;
// //       }

// //       const provider = new ethers.BrowserProvider(window.ethereum);
// //       const signer = await provider.getSigner();
// //       const address = await signer.getAddress();
// //       console.log("Connected wallet:", address);

// //       const accountIdentifier: Identifier = {
// //         identifier: address,
// //         identifierKind: "Ethereum",
// //       };
// //       
// //       const xmtpSigner: Signer = {
// //         type: "EOA",
// //         getIdentifier: () => accountIdentifier,
// //         signMessage: async (message: string): Promise<Uint8Array> => {
// //           const signature = await signer.signMessage(message);
// //           return hexToUint8Array(signature);
// //         },
// //       };

// //       // ✅ Using 'dev' environment
// //       const client = await Client.create(xmtpSigner, { env: "dev" });
// //       setXmtpClient(client);
// //       console.log("XMTP client created ✅");
// //       
// //       // NOTE: The stream logic below is synchronous and may block the connection function. 
// //       // It's generally better to place streaming logic inside a useEffect hook.
// //       const stream = await client.conversations.streamAllMessages({
// //           consentStates: [ConsentState.Allowed],
// //           onValue: (message) => {
// //             // Handle received message here
// //             console.log(`New message:${JSON.stringify(message,replacer,2)}`);
// //           },
// //           onError: (error) => {
// //             console.error(error);
// //           },
// //           onFail: () => {
// //             console.log('Stream failed');
// //           },
// //       });

// //       // This part is commented out to prevent blocking the async function.
// //       // for await (const message of stream) {
// //       //   console.log('New message:', message);
// //       // } 
// //       
// //       // ✅ Check if recipient can receive messages
// //       const canMessageMap = await client.canMessage(recipientIdentifier);
// //       console.log(`can message map: ${canMessageMap}`)
// //       const canMessage = canMessageMap.get(recipientWallet);
// //       console.log(`Can message ${recipientWallet}?`, canMessage);
// //       
// //       // ✅ The replacer function is correctly used here to prevent the BigInt error.
// //       const inboxstate = await client.preferences.inboxState(); 
// //       console.log(`My Inbox Id :${inboxstate.inboxId}`);
// //       console.log(`Inbox State :${JSON.stringify(inboxstate, replacer, 2)}`);

// //       if (!canMessage) {
// //         setConnectionError("Recipient is not registered on XMTP.");
// //         return;
// //       }

// //       // ✅ Use recipientWallet consistently
// //       const convo = await client.conversations.newDm("858a4348f664e57c7b1ce19ce4ab01eaee9e18c072b97dfe95f705d69cc3d207"); 
// //       
// //       // PeerInboxId is useful for debugging/display, but not essential for send
// //       const peerInboxId = await convo.peerInboxId();
// //       console.log( "Peer Inbox Id", peerInboxId); 
// //       
// //       await convo.send("Hello 👋");
// //       setMessages((prev) => [...prev, { sender: "You", content: "Hello 👋" }]);

// //       const allowedConvos = await client.conversations.list({
// //         consentStates: [ConsentState.Allowed],
// //       });
// //       console.log("Allowed conversations:", allowedConvos);
// //     } catch (err: any) {
// //       console.error("XMTP Error:", err);
// //       setConnectionError(err.message || "Connection failed.");
// //     } finally {
// //       setIsConnecting(false);
// //     }
// //   };

// //   const sendMessage = async (): Promise<void> => {
// //     if (!xmtpClient || !newMessage.trim()) return;
// //     try {
// //       // 🛑 FIX: Changed hardcoded sender ID to the correct recipient wallet address.
// //       const convo = await xmtpClient.conversations.newDm(recipientWallet); 
// //       
// //       await convo.send(newMessage.trim());
// //       setMessages((prev) => [
// //         ...prev,
// //         { sender: "You", content: newMessage.trim() },
// //       ]);
// //       setNewMessage("");
// //     } catch (err: any) {
// //       console.error("Send error:", err);
// //       setConnectionError(err.message);
// //     }
// //   };

// //   const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
// //     if (e.key === "Enter") sendMessage();
// //   };

// //   const handleClearLocalXmtpData = async () => {
// //     try {
// //       await clearXmtpIndexedDB();
// //       setXmtpClient(null);
// //       alert("XMTP cache cleared ✅");
// //     } catch (err: any) {
// //       setConnectionError(err.message);
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col h-screen bg-gray-900 text-white p-4">
// //       {/* Header */}
// //       <div className="flex items-center justify-between mb-4">
// //         <h1 className="text-lg font-bold">XMTP Chat</h1>
// //         <button
// //           onClick={handleConnection}
// //           disabled={isConnecting || !!xmtpClient}
// //           className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
// //         >
// //           {isConnecting
// //             ? "Connecting..."
// //             : xmtpClient
// //             ? "Connected ✅"
// //             : "Connect XMTP"}
// //         </button>
// //       </div>

// //       {/* Chat Area */}
// //       <div className="flex-1 overflow-y-auto bg-gray-800 p-3 rounded-lg">
// //         {messages.map((msg, i) => (
// //           <div
// //             key={i}
// //             className={`flex ${
// //               msg.sender === "You" ? "justify-end" : "justify-start"
// //             } mb-2`}
// //           >
// //             <div
// //               className={`p-2 rounded-xl max-w-xs ${
// //                 msg.sender === "You"
// //                   ? "bg-green-600 text-white"
// //                   : "bg-gray-300 text-black"
// //               }`}
// //             >
// //               <p className="text-sm">{msg.content}</p>
// //             </div>
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Input */}
// //       <div className="mt-3 flex items-center bg-gray-700 rounded-lg p-2">
// //         <input
// //           type="text"
// //           className="flex-1 bg-transparent text-white outline-none px-2"
// //           placeholder="Type your message..."
// //           value={newMessage}
// //           onChange={(e: ChangeEvent<HTMLInputElement>) =>
// //             setNewMessage(e.target.value)
// //           }
// //           onKeyDown={handleKeyDown}
// //         />
// //         <button
// //           onClick={sendMessage}
// //           className="ml-2 p-2 bg-blue-500 rounded-lg hover:bg-blue-600"
// //         >
// //           <Send size={20} />
// //         </button>
// //       </div>

// //       {/* Error + Tools */}
// //       {connectionError && (
// //         <div className="mt-3 bg-red-500 text-white p-2 rounded">
// //           {connectionError}
// //         </div>
// //       )}
// //       {xmtpClient && (
// //         <button
// //           onClick={handleClearLocalXmtpData}
// //           className="mt-3 bg-yellow-500 text-black p-2 rounded"
// //         >
// //           Clear XMTP Cache
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // export default ChatWindow;

// import React, {
//   useState,
//   useRef,
//   useEffect,
//   ChangeEvent,
//   KeyboardEvent,
// } from "react";
// // 🎨 MUI Imports
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Paper,
//   CircularProgress,
//   IconButton,
//   createTheme,
//   ThemeProvider,
//   CssBaseline,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import ClearIcon from "@mui/icons-material/Clear";

// // Note: Removed 'lucide-react' Send import as it's replaced by MUI SendIcon

// import { ethers } from "ethers";
// import {
//   Client,
//   ConsentState,
//   // Type imports are now correct for TSX
//   type Signer,
//   type Identifier,
//   // Global type for window.ethereum to fix TS error
// } from "@xmtp/browser-sdk";

// // Extend the Window interface for MetaMask detection
// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// // --- START: LOGIC (UNCHANGED) ---

// // 🌐 Helper to clear XMTP IndexedDB cache
// async function clearXmtpIndexedDB(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.deleteDatabase("xmtp_db");
//     request.onsuccess = () => resolve();
//     request.onerror = (event) => reject((event.target as any).error);
//     request.onblocked = () =>
//       reject(new Error("IndexedDB deletion blocked. Close other tabs."));
//   });
// }

// // 🧰 Utility: convert hex signature string → Uint8Array
// function hexToUint8Array(hex: string): Uint8Array {
//   if (hex.startsWith("0x")) hex = hex.slice(2);
//   const match = hex.match(/.{1,2}/g);
//   if (!match) return new Uint8Array();
//   return new Uint8Array(match.map((b) => parseInt(b, 16)));
// }

// // ✅ FIX: Custom JSON replacer to handle BigInt (Correctly defined here)
// function replacer(key: any, value: any) {
//   if (typeof value === 'bigint') {
//     return value.toString(); // Convert BigInt to string before serialization
//   }
//   return value;
// }

// // 🎨 MUI THEME DEFINITION
// // Extend the MUI Palette to include custom colors for chat bubbles
// declare module '@mui/material/styles' {
//   interface Palette {
//     chat: {
//       you: string;
//       them: string;
//       text: string;
//     };
//   }
//   interface PaletteOptions {
//     chat?: {
//       you?: string;
//       them?: string;
//       text?: string;
//     };
//   }
// }

// const customTheme = createTheme({
//   palette: {
//     // Dark mode for base colors (text white, background dark)
//     mode: 'dark', 
//     primary: {
//       main: '#6C63FF', // Primary: #6C63FF
//     },
//     background: {
//       default: '#000000', // Black background
//       paper: '#1a1a1a', // Slightly lighter black for chat containers/input
//     },
//     text: {
//       primary: '#FFFFFF', // White text
//     },
//     error: {
//         main: '#ff4d4f', // Standard error red
//     },
//     // Custom colors for chat bubbles
//     chat: {
//       you: '#6C63FF',      // Your messages: #6C63FF
//       them: '#333333',     // Other person's messages: Dark Gray
//       text: '#FFFFFF',     // Bubble text: White
//     }
//   },
//   components: {
//     MuiCssBaseline: {
//         styleOverrides: {
//             body: {
//                 // Ensure scrollbars are dark-themed for consistency
//                 scrollbarColor: "#6C63FF #1a1a1a",
//                 "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
//                     backgroundColor: "#1a1a1a",
//                 },
//                 "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
//                     borderRadius: 8,
//                     backgroundColor: "#6C63FF",
//                     minHeight: 24,
//                     border: "3px solid #1a1a1a",
//                 },
//             },
//         },
//     },
//   },
// });

// const ChatWindow: React.FC = () => {
//   const [messages, setMessages] = useState<
//     { sender: string; content: string }[]
//   >([]);
  
//   const [newMessage, setNewMessage] = useState("");
//   const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
//   const [connectionError, setConnectionError] = useState<string | null>(null);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement | null>(null);

//   // ✅ Recipient Wallet address is used consistently
//   const recipientWallet = "0x242f10bd5b6f95bb7f1d53b727c199e2e96e9c9f";
//   const recipientIdentifier: Identifier[] = [
//     {
//       identifier: recipientWallet,
//       identifierKind: "Ethereum",
//     },
//   ];

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);


//   const handleConnection = async (): Promise<void> => {
//     if (isConnecting || xmtpClient) return;
//     setIsConnecting(true);
//     setConnectionError(null);

//     try {
//       if (!window.ethereum) {
//         setConnectionError("MetaMask not detected. Please install it first.");
//         return;
//       }

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const address = await signer.getAddress();
//       console.log("Connected wallet:", address);

//       const accountIdentifier: Identifier = {
//         identifier: address,
//         identifierKind: "Ethereum",
//       };
      
//       const xmtpSigner: Signer = {
//         type: "EOA",
//         getIdentifier: () => accountIdentifier,
//         signMessage: async (message: string): Promise<Uint8Array> => {
//           const signature = await signer.signMessage(message);
//           return hexToUint8Array(signature);
//         },
//       };

//       // ✅ Using 'dev' environment
//       const client = await Client.create(xmtpSigner, { env: "dev" });
//       setXmtpClient(client);
//       console.log("XMTP client created ✅");
      
//       // NOTE: The stream logic below is synchronous and may block the connection function. 
//       // It's generally better to place streaming logic inside a useEffect hook.
//       const stream = await client.conversations.streamAllMessages({
//           consentStates: [ConsentState.Allowed],
//           onValue: (message) => {
//             // Handle received message here
//             console.log(`New message:${JSON.stringify(message,replacer,2)}`);
//           },
//           onError: (error) => {
//             console.error(error);
//           },
//           onFail: () => {
//             console.log('Stream failed');
//           },
//       });

//       // This part is commented out to prevent blocking the async function.
//       // for await (const message of stream) {
//       //    console.log('New message:', message);
//       // } 
      
//       // ✅ Check if recipient can receive messages
//       const canMessageMap = await client.canMessage(recipientIdentifier);
//       console.log(`can message map: ${canMessageMap}`)
//       const canMessage = canMessageMap.get(recipientWallet);
//       console.log(`Can message ${recipientWallet}?`, canMessage);
      
//       // ✅ The replacer function is correctly used here to prevent the BigInt error.
//       const inboxstate = await client.preferences.inboxState(); 
//       console.log(`My Inbox Id :${inboxstate.inboxId}`);
//       console.log(`Inbox State :${JSON.stringify(inboxstate, replacer, 2)}`);

//       if (!canMessage) {
//         setConnectionError("Recipient is not registered on XMTP.");
//         return;
//       }

//       // ✅ Use recipientWallet consistently
//       const convo = await client.conversations.newDm("858a4348f664e57c7b1ce19ce4ab01eaee9e18c072b97dfe95f705d69cc3d207"); 
      
//       // PeerInboxId is useful for debugging/display, but not essential for send
//       const peerInboxId = await convo.peerInboxId();
//       console.log( "Peer Inbox Id", peerInboxId); 
      
//       await convo.send("Hello 👋");
//       setMessages((prev) => [...prev, { sender: "You", content: "Hello 👋" }]);

//       const allowedConvos = await client.conversations.list({
//         consentStates: [ConsentState.Allowed],
//       });
//       console.log("Allowed conversations:", allowedConvos);
//     } catch (err: any) {
//       console.error("XMTP Error:", err);
//       setConnectionError(err.message || "Connection failed.");
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   const sendMessage = async (): Promise<void> => {
//     if (!xmtpClient || !newMessage.trim()) return;
//     try {
//       // 🛑 FIX: Changed hardcoded sender ID to the correct recipient wallet address.
//       const convo = await xmtpClient.conversations.newDm("858a4348f664e57c7b1ce19ce4ab01eaee9e18c072b97dfe95f705d69cc3d207"); 
      
//       await convo.send(newMessage.trim());
//       setMessages((prev) => [
//         ...prev,
//         { sender: "You", content: newMessage.trim() },
//       ]);
//       setNewMessage("");
//     } catch (err: any) {
//       console.error("Send error:", err);
//       setConnectionError(err.message);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   const handleClearLocalXmtpData = async () => {
//     try {
//       await clearXmtpIndexedDB();
//       setXmtpClient(null);
//       alert("XMTP cache cleared ✅");
//     } catch (err: any) {
//       setConnectionError(err.message);
//     }
//   };

//   // --- END: LOGIC (UNCHANGED) ---

//   // 💻 UI (UPDATED WITH MUI & TSX)
//   return (
//     <ThemeProvider theme={customTheme}>
//       <CssBaseline />
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           width:"60%",
//           height: "100vh",
//           p: 2,
//           // Black background
//           bgcolor: 'background.default',
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             mb: 2,
//             pb: 1,
//             borderBottom: '1px solid #333333',
//           }}
//         >
//           <Typography variant="h6" fontWeight="bold" color="text.primary">
//             XMTP Chat
//           </Typography>
//           <Button
//             onClick={handleConnection}
//             disabled={isConnecting || !!xmtpClient}
//             variant="contained"
//             color="primary" // Uses #6C63FF
//             sx={{
//               minWidth: 150,
//               // Explicitly set background color
//               bgcolor: '#6C63FF', 
//               '&:hover': {
//                 bgcolor: '#5a55d0', // Slightly darker hover
//               },
//             }}
//           >
//             {isConnecting ? (
//               <CircularProgress size={20} color="inherit" />
//             ) : xmtpClient ? (
//               "Connected ✅"
//             ) : (
//               "Connect XMTP"
//             )}
//           </Button>
//         </Box>

//         {/* Chat Area */}
//         <Box
//           sx={{
//             flex: 1,
//             overflowY: "auto",
//             // Dark gray for chat container background
//             bgcolor: customTheme.palette.background.paper, 
//             p: 2,
//             borderRadius: 2,
//             mb: 2,
//             // Ensure white text color
//             color: 'text.primary',
//           }}
//         >
//           {messages.map((msg, i) => {
//             const isYou = msg.sender === "You";
//             return (
//               <Box
//                 key={i}
//                 sx={{
//                   display: "flex",
//                   justifyContent: isYou ? "flex-end" : "flex-start",
//                   mb: 1.5,
//                 }}
//               >
//                 <Paper
//                   sx={{
//                     p: 1.5,
//                     borderRadius: isYou ? "15px 15px 0 15px" : "15px 15px 15px 0",
//                     maxWidth: "70%",
//                     // Bubble color: #6C63FF for you, dark gray for them
//                     bgcolor: isYou ? customTheme.palette.chat.you : customTheme.palette.chat.them, 
//                     // Text color: White for both
//                     color: customTheme.palette.chat.text, 
//                     wordWrap: "break-word",
//                   }}
//                   elevation={1}
//                 >
//                   <Typography variant="body2">{msg.content}</Typography>
//                 </Paper>
//               </Box>
//             );
//           })}
//           <div ref={messagesEndRef} />
//         </Box>

//         {/* Input */}
//         <Paper
//           component="form"
//           sx={{
//             p: "2px 4px",
//             display: "flex",
//             alignItems: "center",
//             bgcolor: customTheme.palette.background.paper, // Dark gray container
//             borderRadius: 2,
//             border: '1px solid #333333',
//           }}
//           onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
//           elevation={3}
//         >
//           <TextField
//             fullWidth
//             variant="standard"
//             placeholder="Type your message..."
//             value={newMessage}
//             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//               setNewMessage(e.target.value)
//             }
//             onKeyDown={handleKeyDown}
//             InputProps={{
//               disableUnderline: true, // Remove the standard underline
//               sx: {
//                 color: 'text.primary',
//                 ml: 1,
//                 py: 0.5,
//               }
//             }}
//           />
//           <IconButton
//             type="button"
//             color="primary" // Uses #6C63FF
//             sx={{ p: "10px" }}
//             aria-label="send"
//             onClick={sendMessage}
//             disabled={!xmtpClient || !newMessage.trim()}
//           >
//             <SendIcon />
//           </IconButton>
//         </Paper>

//         {/* Error + Tools */}
//         {connectionError && (
//           <Box
//             sx={{
//               mt: 2,
//               bgcolor: "error.main",
//               color: "white",
//               p: 1.5,
//               borderRadius: 1,
//               textAlign: 'center',
//             }}
//           >
//             <Typography variant="body2">{connectionError}</Typography>
//           </Box>
//         )}
//         {xmtpClient && (
//           <Button
//             onClick={handleClearLocalXmtpData}
//             variant="outlined"
//             color="inherit"
//             startIcon={<ClearIcon />}
//             sx={{
//               mt: 2,
//               color: 'text.primary',
//               borderColor: '#6C63FF', // Primary border color
//               '&:hover': {
//                 bgcolor: '#6C63FF1a', // Light purple hover background
//                 borderColor: '#6C63FF',
//               },
//             }}
//           >
//             Clear XMTP Cache
//           </Button>
//         )}
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default ChatWindow;


// import React, {
//   useState,
//   useRef,
//   useEffect,
//   ChangeEvent,
//   KeyboardEvent,
// } from "react";
// // 🎨 MUI Imports
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Paper,
//   CircularProgress,
//   IconButton,
//   createTheme,
//   ThemeProvider,
//   CssBaseline,
// } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";
// import ClearIcon from "@mui/icons-material/Clear";
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'; // Icon for message area placeholder
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// import { ethers } from "ethers";
// import {
//   Client,
//   ConsentState,
//   type Signer,
//   type Identifier,
// } from "@xmtp/browser-sdk";

// // Extend the Window interface for MetaMask detection
// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// // --- XMTP LOGIC & UTILITIES (UNCHANGED) ---

// async function clearXmtpIndexedDB(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.deleteDatabase("xmtp_db");
//     request.onsuccess = () => resolve();
//     request.onerror = (event) => reject((event.target as any).error);
//     request.onblocked = () =>
//       reject(new Error("IndexedDB deletion blocked. Close other tabs."));
//   });
// }

// function hexToUint8Array(hex: string): Uint8Array {
//   if (hex.startsWith("0x")) hex = hex.slice(2);
//   const match = hex.match(/.{1,2}/g);
//   if (!match) return new Uint8Array();
//   return new Uint8Array(match.map((b) => parseInt(b, 16)));
// }

// function replacer(key: any, value: any) {
//   if (typeof value === 'bigint') {
//     return value.toString();
//   }
//   return value;
// }

// // 🎨 MUI THEME DEFINITION (Customized for WhatsApp look)

// declare module '@mui/material/styles' {
//   interface Palette {
//     chat: {
//       you: string;
//       them: string;
//       textYou: string;
//       textThem: string;
//     };
//   }
//   interface PaletteOptions {
//     chat?: {
//       you?: string;
//       them?: string;
//       textYou?: string;
//       textThem?: string;
//     };
//   }
// }

// const customTheme = createTheme({
//   palette: {
//     mode: 'light', // Light mode base for the background look
//     primary: {
//       main: '#005C4B', // WhatsApp Primary Green
//     },
//     background: {
//       default: '#E5DDD5', // Typical chat background color
//       paper: '#F0F0F0', // Header/Input background
//     },
//     text: {
//       primary: '#000000', 
//       secondary: '#666666',
//     },
//     chat: {
//       you: '#DCF8C6', // Light green for your bubbles
//       them: '#FFFFFF', // White for the other person's bubbles
//       textYou: '#000000',
//       textThem: '#000000',
//     }
//   },
//   components: {
//     MuiCssBaseline: {
//       styleOverrides: {
//         body: {
//           backgroundColor: '#E5DDD5',
//         },
//       },
//     },
//   },
// });


// // 🖼️ Dummy Component for Chat Wallpaper Effect
// const ChatBackground = () => (
//     // You would use a CSS background image URL here for a real pattern
//     // For now, we'll use a subtle color gradient/texture simulation via Tailwind
//     <div 
//         className="absolute inset-0 z-0 bg-repeat bg-center opacity-10" 
//         style={{backgroundImage: `url('https://cdn.wallpapersafari.com/60/76/f52L0S.jpg')`}}
//         aria-hidden="true" 
//     />
// )

// // 💬 Message Bubble Component (Refined GUI)
// interface MessageBubbleProps {
//     msg: { sender: string; content: string };
//     index: number;
// }

// const MessageBubble: React.FC<MessageBubbleProps> = ({ msg, index }) => {
//     const isYou = msg.sender === "You";
//     const theme = customTheme; // Access theme directly as it's defined in the same scope

//     // Tailwind classes for the WhatsApp-style bubble shape
//     const bubbleClasses = isYou
//         ? `bg-chat-you text-chat-textYou rounded-xl rounded-br-none`
//         : `bg-chat-them text-chat-textThem rounded-xl rounded-tl-none shadow-sm`;

//     // Inline style for the staggered "pop-in" animation (crazy animation request)
//     const animationStyle = { 
//         animation: 'popIn 0.35s ease-out forwards', 
//         animationDelay: `${index * 0.05}s` 
//     };

//     return (
//         <div
//             key={index}
//             className={`flex mb-3 ${isYou ? "justify-end" : "justify-start"} animate-pop-in`}
//             style={animationStyle}
//         >
//             <div
//                 className={`
//                     p-3 max-w-[80%] sm:max-w-md min-w-[100px] text-sm break-words relative
//                     ${isYou ? 'ml-auto bg-[#DCF8C6] text-black rounded-xl rounded-br-none' : 'mr-auto bg-white text-black rounded-xl rounded-tl-none shadow-sm'}
//                 `}
//             >
//                 {msg.content}
//             </div>
//         </div>
//     );
// };


// // 📱 MAIN CHAT WINDOW (GUI FIX)
// const ChatWindow: React.FC = () => {
//     // --- Logic State Declarations (DO NOT TOUCH) ---
//     const [messages, setMessages] = useState<
//         { sender: string; content: string }[]
//     >([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
//     const [connectionError, setConnectionError] = useState<string | null>(null);
//     const [isConnecting, setIsConnecting] = useState(false);
//     const messagesEndRef = useRef<HTMLDivElement | null>(null);

//     const recipientWallet = "0x242f10bd5b6f95bb7f1d53b727c199e2e96e9c9f";
//     const recipientIdentifier: Identifier[] = [
//         { identifier: recipientWallet, identifierKind: "Ethereum" },
//     ];
    
//     // --- Logic Handlers (DO NOT TOUCH) ---
//     useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
//     // const handleConnection = async (): Promise<void> => { /* ... (Logic kept intact) */ };
//     // const sendMessage = async (): Promise<void> => { /* ... (Logic kept intact) */ };
//     // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") sendMessage(); };
//     // const handleClearLocalXmtpData = async () => { /* ... (Logic kept intact) */ };

//       const handleConnection = async (): Promise<void> => {
//     if (isConnecting || xmtpClient) return;
//     setIsConnecting(true);
//     setConnectionError(null);

//     try {
//       if (!window.ethereum) {
//         setConnectionError("MetaMask not detected. Please install it first.");
//         return;
//       }

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const address = await signer.getAddress();
//       console.log("Connected wallet:", address);

//       const accountIdentifier: Identifier = {
//         identifier: address,
//         identifierKind: "Ethereum",
//       };
      
//       const xmtpSigner: Signer = {
//         type: "EOA",
//         getIdentifier: () => accountIdentifier,
//         signMessage: async (message: string): Promise<Uint8Array> => {
//           const signature = await signer.signMessage(message);
//           return hexToUint8Array(signature);
//         },
//       };

//       // ✅ Using 'dev' environment
//       const client = await Client.create(xmtpSigner, { env: "dev" });
//       setXmtpClient(client);
//       console.log("XMTP client created ✅");
      
//       // NOTE: The stream logic below is synchronous and may block the connection function. 
//       // It's generally better to place streaming logic inside a useEffect hook.
//       const stream = await client.conversations.streamAllMessages({
//           consentStates: [ConsentState.Allowed],
//           onValue: (message) => {
//             // Handle received message here
//             console.log(`New message:${JSON.stringify(message,replacer,2)}`);
//             console.log(`Recived Message :${message.content}`)
//           },
//           onError: (error) => {
//             console.error(error);
//           },
//           onFail: () => {
//             console.log('Stream failed');
//           },
//       });

//       // This part is commented out to prevent blocking the async function.
//       // for await (const message of stream) {
//       //    console.log('New message:', message);
//       // } 
      
//       // ✅ Check if recipient can receive messages
//       const canMessageMap = await client.canMessage(recipientIdentifier);
//       console.log(`can message map: ${canMessageMap}`)
//       const canMessage = canMessageMap.get(recipientWallet);
//       console.log(`Can message ${recipientWallet}?`, canMessage);
      
//       // ✅ The replacer function is correctly used here to prevent the BigInt error.
//       const inboxstate = await client.preferences.inboxState(); 
//       console.log(`My Inbox Id :${inboxstate.inboxId}`);
//       console.log(`Inbox State :${JSON.stringify(inboxstate, replacer, 2)}`);

//       if (!canMessage) {
//         setConnectionError("Recipient is not registered on XMTP.");
//         return;
//       }

//       // ✅ Use recipientWallet consistently
//       const convo = await client.conversations.newDm("858a4348f664e57c7b1ce19ce4ab01eaee9e18c072b97dfe95f705d69cc3d207"); 
      
//       // PeerInboxId is useful for debugging/display, but not essential for send
//       const peerInboxId = await convo.peerInboxId();
//       console.log( "Peer Inbox Id", peerInboxId); 
      
//       await convo.send("Hello 👋");
//       setMessages((prev) => [...prev, { sender: "You", content: "Hello 👋" }]);

//       const allowedConvos = await client.conversations.list({
//         consentStates: [ConsentState.Allowed],
//       });
//       console.log("Allowed conversations:", allowedConvos);
//     } catch (err: any) {
//       console.error("XMTP Error:", err);
//       setConnectionError(err.message || "Connection failed.");
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   const sendMessage = async (): Promise<void> => {
//     if (!xmtpClient || !newMessage.trim()) return;
//     try {
//       // 🛑 FIX: Changed hardcoded sender ID to the correct recipient wallet address.
//       const convo = await xmtpClient.conversations.newDm("858a4348f664e57c7b1ce19ce4ab01eaee9e18c072b97dfe95f705d69cc3d207"); 
      
//       await convo.send(newMessage.trim());
//       setMessages((prev) => [
//         ...prev,
//         { sender: "You", content: newMessage.trim() },
//       ]);
//       setNewMessage("");
//     } catch (err: any) {
//       console.error("Send error:", err);
//       setConnectionError(err.message);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   const handleClearLocalXmtpData = async () => {
//     try {
//       await clearXmtpIndexedDB();
//       setXmtpClient(null);
//       alert("XMTP cache cleared ✅");
//     } catch (err: any) {
//       setConnectionError(err.message);
//     }
//   };
    
    
//     // --- UI/GUI RENDER ---
//     return (
//         <ThemeProvider theme={customTheme}>
//             <CssBaseline />

//             {/* Inject Animation Keyframes */}
//             <style global jsx>{`
//                 @keyframes popIn {
//                     0% { opacity: 0; transform: scale(0.9) translateY(10px); }
//                     100% { opacity: 1; transform: scale(1) translateY(0); }
//                 }
//             `}</style>
            
//             <div className="flex flex-col h-screen w-full mx-auto max-w-7xl shadow-2xl">
                
//                 {/* 1. Header (Green WhatsApp Bar) */}
//                 <Box
//                     className="flex justify-between items-center px-4 py-3 shadow-md"
//                     sx={{ bgcolor: 'primary.main', color: 'white' }}
//                 >
//                     <div className="flex items-center space-x-3">
//                         {/* Recipient Info */}
//                         <AccountCircleIcon sx={{ fontSize: 40 }} />
//                         <Typography variant="subtitle1" fontWeight="medium">
//                             {xmtpClient ? "Recipient Wallet" : "XMTP Chat"}
//                         </Typography>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                          {/* Connection Status Button */}
//                          <Button
//                             onClick={handleConnection}
//                             disabled={isConnecting || !!xmtpClient}
//                             variant="contained"
//                             size="small"
//                             sx={{
//                                 bgcolor: xmtpClient ? '#128C7E' : '#FFFFFF30', // Connected Green or Transparent White
//                                 color: 'white',
//                                 '&:hover': { bgcolor: xmtpClient ? '#075E54' : '#FFFFFF50' },
//                             }}
//                         >
//                             {isConnecting ? (
//                                 <CircularProgress size={16} color="inherit" />
//                             ) : xmtpClient ? (
//                                 "Online"
//                             ) : (
//                                 "Connect"
//                             )}
//                         </Button>
//                         <IconButton color="inherit" size="small"><MoreVertIcon /></IconButton>
//                     </div>
//                 </Box>

//                 {/* 2. Message Area (Chat Wallpaper) */}
//                 <Box
//                     className="flex-1 overflow-y-auto p-4 relative"
//                     sx={{ bgcolor: 'background.default' }}
//                 >
//                     <ChatBackground />
//                     <div className="relative z-10">
//                         {messages.length === 0 ? (
//                             <div className="flex flex-col items-center justify-center h-full text-gray-500 pt-20">
//                                 <ChatBubbleOutlineIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
//                                 <Typography variant="h6" className="mt-4">
//                                     Start a conversation
//                                 </Typography>
//                                 <Typography variant="body2" className="text-center w-2/3 mt-2">
//                                     Connect your wallet and send the first secure message over XMTP.
//                                 </Typography>
//                             </div>
//                         ) : (
//                             messages.map((msg, i) => (
//                                 <MessageBubble key={i} msg={msg} index={i} />
//                             ))
//                         )}
//                         <div ref={messagesEndRef} />
//                     </div>
//                 </Box>

//                 {/* 3. Input Bar (Footer) */}
//                 <Box
//                     className="p-3 shadow-xl"
//                     sx={{ bgcolor: 'background.paper' }}
//                 >
//                     <Paper
//                         component="form"
//                         className="flex items-center p-1 rounded-full space-x-1"
//                         sx={{ bgcolor: 'white', boxShadow: 'none' }}
//                         onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
//                     >
//                         <TextField
//                             fullWidth
//                             variant="standard"
//                             placeholder="Type a message..."
//                             value={newMessage}
//                             onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
//                             onKeyDown={handleKeyDown}
//                             InputProps={{
//                                 disableUnderline: true,
//                                 sx: { ml: 2, py: 0.5, color: 'text.primary' }
//                             }}
//                             disabled={!xmtpClient}
//                         />
//                         <IconButton
//                             type="submit"
//                             color="primary"
//                             sx={{ 
//                                 bgcolor: 'primary.main', // Green background for send button
//                                 color: 'white',
//                                 p: 1.5,
//                                 '&:hover': { bgcolor: '#075E54' },
//                                 '&:disabled': { bgcolor: '#CCCCCC', color: '#888888' }
//                             }}
//                             aria-label="send"
//                             disabled={!xmtpClient || !newMessage.trim()}
//                         >
//                             <SendIcon />
//                         </IconButton>
//                     </Paper>
//                 </Box>

//                 {/* 4. Error and Tool Buttons */}
//                 {(connectionError || xmtpClient) && (
//                     <div className="p-2 flex justify-between items-center bg-gray-100 border-t border-gray-200">
//                         {connectionError && (
//                             <Typography variant="body2" color="error" className="mr-4">
//                                 Error: {connectionError}
//                             </Typography>
//                         )}
//                         {xmtpClient && (
//                             <Button
//                                 onClick={handleClearLocalXmtpData}
//                                 variant="text"
//                                 size="small"
//                                 color="error"
//                                 startIcon={<ClearIcon />}
//                             >
//                                 Clear XMTP Cache
//                             </Button>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </ThemeProvider>
//     );
// };

// export default ChatWindow;


import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from "react";
// 🎨 MUI Imports
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ClearIcon from "@mui/icons-material/Clear";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { ethers } from "ethers";
import {
  Client,
  ConsentState,
  type Signer,
  type Identifier,
  type Message,
  type Stream,
} from "@xmtp/browser-sdk";

// Extend the Window interface for MetaMask detection
declare global {
  interface Window {
    ethereum?: any;
  }
}

// --- XMTP LOGIC & UTILITIES (UNCHANGED) ---

async function clearXmtpIndexedDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase("xmtp_db");
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject((event.target as any).error);
    request.onblocked = () =>
      reject(new Error("IndexedDB deletion blocked. Close other tabs."));
  });
}

function hexToUint8Array(hex: string): Uint8Array {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  const match = hex.match(/.{1,2}/g);
  if (!match) return new Uint8Array();
  return new Uint8Array(match.map((b) => parseInt(b, 16)));
}

function replacer(key: any, value: any) {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

// 🎨 MUI THEME DEFINITION (UNCHANGED)
declare module '@mui/material/styles' {
  interface Palette {
    chat: {
      you: string;
      them: string;
      textYou: string;
      textThem: string;
    };
  }
  interface PaletteOptions {
    chat?: {
      you?: string;
      them?: string;
      textYou?: string;
      textThem?: string;
    };
  }
}

const customTheme = createTheme({
  palette: {
    mode: 'light', 
    primary: {
      main: '#005C4B', 
    },
    background: {
      default: '#E5DDD5', 
      paper: '#F0F0F0', 
    },
    text: {
      primary: '#000000', 
      secondary: '#666666',
    },
    chat: {
      you: '#DCF8C6', 
      them: '#FFFFFF', 
      textYou: '#000000',
      textThem: '#000000',
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#E5DDD5',
        },
      },
    },
  },
});


// 🖼️ Dummy Component for Chat Wallpaper Effect (UNCHANGED)
const ChatBackground = () => (
    <div 
        className="absolute inset-0 z-0 bg-repeat bg-center opacity-10" 
        style={{backgroundImage: `url('https://cdn.wallpapersafari.com/60/76/f52L0S.jpg')`}}
        aria-hidden="true" 
    />
)

// 💬 Message Bubble Component (UNCHANGED)
interface MessageBubbleProps {
    msg: { sender: string; content: string };
    index: number;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ msg, index }) => {
    const isYou = msg.sender === "You";
    const theme = customTheme; 

    // Inline style for the staggered "pop-in" animation (crazy animation request)
    const animationStyle = { 
        animation: 'popIn 0.35s ease-out forwards', 
        animationDelay: `${index * 0.05}s` 
    };

    return (
        <div
            key={index}
            className={`flex mb-3 ${isYou ? "justify-end" : "justify-start"} animate-pop-in`}
            style={animationStyle}
        >
            <div
                className={`
                    p-3 max-w-[80%] sm:max-w-md min-w-[100px] text-sm break-words relative
                    ${isYou ? 'ml-auto bg-[#DCF8C6] text-black rounded-xl rounded-br-none' : 'mr-auto bg-white text-black rounded-xl rounded-tl-none shadow-sm'}
                `}
            >
                {msg.content}
            </div>
        </div>
    );
};


// 📱 MAIN CHAT WINDOW (FIXED LOGIC)
const ChatWindow: React.FC = () => {
    // --- Logic State Declarations (UNCHANGED) ---
    const [messages, setMessages] = useState<
        { sender: string; content: string }[]
    >([]);
    const [newMessage, setNewMessage] = useState("");
    const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const recipientWallet = "0x242f10bd5b6f95bb7f1d53b727c199e2e96e9c9f";
			  const recepientinbox = "858a4348f664e57c7b1ce19ce4ab01eaee9e18c072b97dfe95f705d69cc3d207"
    
    const recipientIdentifier: Identifier[] = [
        { identifier: recipientWallet, identifierKind: "Ethereum" },
    ];
    
    // --- Autoscroll (UNCHANGED) ---
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
    
    // --- Message Stream Fix: Moved stream logic into useEffect (UNCHANGED) ---
    useEffect(() => {
        if (!xmtpClient) return;

        let messageStream: Stream<Message> | null = null;
        let myAddress: string | null = null;

        const startStream = async () => {
            try {
                // Get the wallet address of the current user
                myAddress = await xmtpClient.address;

                messageStream = await xmtpClient.conversations.streamAllMessages({
                    consentStates: [ConsentState.Allowed],
                    onValue: (message) => {
                        // FIX: Update state with the received message
                        console.log(`Received Message Content: ${message.content}`);

                        const sender = message.senderAddress === myAddress ? "You" : "Them";

                        setMessages((prev) => [
                            ...prev,
                            { sender: sender, content: message.content },
                        ]);
                    },
                    onError: (error) => {
                        console.error("Stream Error:", error);
                    },
                    onFail: () => {
                        console.log('Stream failed');
                    },
                });
            } catch (error) {
                console.error("Failed to establish message stream:", error);
            }
        };

        startStream();

        // Cleanup function: close the stream when component unmounts or client changes
        return () => {
            if (messageStream) {
                messageStream.end();
            }
        };
    }, [xmtpClient]); // Dependency array: runs when xmtpClient changes
    
    // --- handleConnection (FIXED) ---
      const handleConnection = async (): Promise<void> => {
    if (isConnecting || xmtpClient) return;
    setIsConnecting(true);
    setConnectionError(null);

    try {
      if (!window.ethereum) {
        setConnectionError("MetaMask not detected. Please install it first.");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log("Connected wallet:", address);

      const accountIdentifier: Identifier = {
        identifier: address,
        identifierKind: "Ethereum",
      };
      
      const xmtpSigner: Signer = {
        type: "EOA",
        getIdentifier: () => accountIdentifier,
        signMessage: async (message: string): Promise<Uint8Array> => {
          const signature = await signer.signMessage(message);
          return hexToUint8Array(signature);
        },
      };

      // ✅ Create XMTP Client
      const client = await Client.create(xmtpSigner, { env: "dev" });
      setXmtpClient(client);
      console.log("XMTP client created ✅");
      
      // ✅ Check if recipient can receive messages
      const canMessageMap = await client.canMessage(recipientIdentifier);
           // FIX 1: Logging of canMessageMap is safer if serialized, but simpler to remove
           // the log that causes the error when BigInt is present in the Map key/value.
      // console.log(`Can Message Map:${canMessageMap}`) // Removed log
           
      const canMessage = canMessageMap.get(recipientWallet);
					 console.log("can Mesage :",canMessage)
      console.log(`Can Message : ${canMessage}`)
      
      if (!canMessage) {
        setConnectionError("Recipient is not registered on XMTP.");
        return;
      }

      // 🛑 FIX 2: Correct conversation creation using the recipientWallet (Ethereum Address)
      const convo = await client.conversations.newDm(recepientinbox); 
					 console.log("convo 1 :",convo)
      
      const history = await convo.messages();
      // console.log(history) // Removed to prevent error if BigInt is present
      
      // FIX 3: Fixed map block syntax by moving console.log and ensuring return
      const formattedHistory = history.map(msg =>{
//         console.log(`msg test :${msg.content}`);
        return{
            sender: msg.senderAddress === address ? "You" : "Them",
            content: msg.content,
        }
      });
      
      setMessages(formattedHistory);
					 console.log("formattedHistory:",formattedHistory)
					console.log("xmtpClient created...")

    } catch (err: any) {
      console.error("XMTP Error:", err);
      setConnectionError(err.message || "Connection failed.");
    } finally {
      setIsConnecting(false);
    }
  };

  const sendMessage = async (): Promise<void> => {
			  console.log(xmtpClient)
    if (!xmtpClient || !newMessage.trim()) return;
    try {
      // 🛑 FIX 4: Use the correct recipientWallet for sending messages
      const convo = await xmtpClient.conversations.newDm(recepientinbox); 
     console.log("Convo 2:",convo)
      await convo.send(newMessage.trim());
      // We optimistically update the UI instantly for the sender
      setMessages((prev) => [
        ...prev,
        { sender: "You", content: newMessage.trim() },
      ]);
      setNewMessage("");
    } catch (err: any) {
      console.error("Send error:", err);
      setConnectionError(err.message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleClearLocalXmtpData = async () => {
    try {
      await clearXmtpIndexedDB();
      setXmtpClient(null);
      setMessages([]); // Clear messages on client disconnect
      alert("XMTP cache cleared ✅");
    } catch (err: any) {
      setConnectionError(err.message);
    }
  };
    
    // --- UI/GUI RENDER (UNCHANGED) ---
    return (
        <ThemeProvider theme={customTheme}>
            <CssBaseline />
            
            {/* Inject Animation Keyframes */}
            <style global jsx>{`
                @keyframes popIn {
                    0% { opacity: 0; transform: scale(0.9) translateY(10px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
            
            <div className="flex flex-col h-screen w-full mx-auto max-w-7xl shadow-2xl">
                
                {/* 1. Header (Green WhatsApp Bar) */}
                <Box
                    className="flex justify-between items-center px-4 py-3 shadow-md"
                    sx={{ bgcolor: 'primary.main', color: 'white' }}
                >
                    <div className="flex items-center space-x-3">
                        {/* Recipient Info */}
                        <AccountCircleIcon sx={{ fontSize: 40 }} />
                        <Typography variant="subtitle1" fontWeight="medium">
                            {xmtpClient ? "Recipient Wallet" : "XMTP Chat"}
                        </Typography>
                    </div>
                    <div className="flex items-center space-x-2">
                         {/* Connection Status Button */}
                         <Button
                            onClick={handleConnection}
                            disabled={isConnecting || !!xmtpClient}
                            variant="contained"
                            size="small"
                            sx={{
                                bgcolor: xmtpClient ? '#128C7E' : '#FFFFFF30', // Connected Green or Transparent White
                                color: 'white',
                                '&:hover': { bgcolor: xmtpClient ? '#075E54' : '#FFFFFF50' },
                            }}
                        >
                            {isConnecting ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : xmtpClient ? (
                                "Online"
                            ) : (
                                "Connect"
                            )}
                        </Button>
                        <IconButton color="inherit" size="small"><MoreVertIcon /></IconButton>
                    </div>
                </Box>

                {/* 2. Message Area (Chat Wallpaper) */}
                <Box
                    className="flex-1 overflow-y-auto p-4 relative"
                    sx={{ bgcolor: 'background.default' }}
                >
                    <ChatBackground />
                    <div className="relative z-10">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 pt-20">
                                <ChatBubbleOutlineIcon sx={{ fontSize: 80, color: 'text.secondary' }} />
                                <Typography variant="h6" className="mt-4">
                                    Start a conversation
                                </Typography>
                                <Typography variant="body2" className="text-center w-2/3 mt-2">
                                    Connect your wallet and send the first secure message over XMTP.
                                </Typography>
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <MessageBubble key={i} msg={msg} index={i} />
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </Box>

                {/* 3. Input Bar (Footer) */}
                <Box
                    className="p-3 shadow-xl"
                    sx={{ bgcolor: 'background.paper' }}
                >
                    <Paper
                        component="form"
                        className="flex items-center p-1 rounded-full space-x-1"
                        sx={{ bgcolor: 'white', boxShadow: 'none' }}
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                    >
                        <TextField
                            fullWidth
                            variant="standard"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            InputProps={{
                                disableUnderline: true,
                                sx: { ml: 2, py: 0.5, color: 'text.primary' }
                            }}
                            disabled={!xmtpClient}
                        />
                        <IconButton
                            type="submit"
                            color="primary"
                            sx={{ 
                                bgcolor: 'primary.main', 
                                color: 'white',
                                p: 1.5,
                                '&:hover': { bgcolor: '#075E54' },
                                '&:disabled': { bgcolor: '#CCCCCC', color: '#888888' }
                            }}
                            aria-label="send"
                            disabled={!xmtpClient || !newMessage.trim()}
                        >
                            <SendIcon />
                        </IconButton>
                    </Paper>
                </Box>

                {/* 4. Error and Tool Buttons */}
                {(connectionError || xmtpClient) && (
                    <div className="p-2 flex justify-between items-center bg-gray-100 border-t border-gray-200">
                        {connectionError && (
                            <Typography variant="body2" color="error" className="mr-4">
                                Error: {connectionError}
                            </Typography>
                        )}
                        {xmtpClient && (
                            <Button
                                onClick={handleClearLocalXmtpData}
                                variant="text"
                                size="small"
                                color="error"
                                startIcon={<ClearIcon />}
                            >
                                Clear XMTP Cache
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </ThemeProvider>
    );
};

export default ChatWindow;