// // // // // import React, { useState, useEffect, useRef } from "react";
// // // // // import { Client, IdentifierKind, ConsentState } from "@xmtp/browser-sdk";
// // // // // import { ethers } from "ethers";
// // // // // import { 
// // // // //   Search, MoreVertical, ShieldCheck, Send, Phone, Video, 
// // // // //   User, CheckCheck, Zap, Loader2, AlertTriangle, Smile 
// // // // // } from "lucide-react";

// // // // // // --- 1. Sidebar Item Component ---
// // // // // const SidebarItem = ({ chat, selectedId, setSelectedChat }: any) => {
// // // // //   // Use the pre-resolved peerInboxId passed from the main controller
// // // // //   const pId = chat.peerInboxId;
// // // // //   const shortId = pId ? pId.substring(0, 2).toUpperCase() : "ID";

// // // // //   return (
// // // // //     <div 
// // // // //       onClick={() => setSelectedChat(chat.instance)}
// // // // //       className={`flex items-center p-4 cursor-pointer hover:bg-[#202c33] border-b border-gray-800/30 ${selectedId === chat.id ? 'bg-[#2a3942]' : ''}`}
// // // // //     >
// // // // //       <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-emerald-500 flex-shrink-0 text-xs">
// // // // //         {shortId}
// // // // //       </div>
// // // // //       <div className="ml-4 flex-1 overflow-hidden">
// // // // //         <p className="font-bold text-gray-100 truncate text-xs font-mono">
// // // // //           {pId || "Fetching ID..."}
// // // // //         </p>
// // // // //         <p className="text-emerald-500 text-[9px] font-mono uppercase tracking-widest mt-1">
// // // // //           {pId ? `${pId.substring(0, 6)}...${pId.substring(pId.length - 4)}` : "Verified MLS"}
// // // // //         </p>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // // --- 2. Sidebar Component ---
// // // // // const Sidebar = ({ chats, setSelectedChat, selectedId, onNewChat, myInboxId, onSendStatic }: any) => {
// // // // //   const [searchTerm, setSearchTerm] = useState("");

// // // // //   const handleKeyPress = (e: any) => {
// // // // //     if (e.key === 'Enter' && searchTerm.trim()) {
// // // // //       const input = searchTerm.trim();
// // // // //       if (input.startsWith("0x") && input.length === 42) {
// // // // //         onNewChat({ identifier: input.toLowerCase(), identifierKind: IdentifierKind.Ethereum });
// // // // //       } else {
// // // // //         onNewChat(input);
// // // // //       }
// // // // //       setSearchTerm("");
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="w-1/4 bg-[#111b21] border-r border-gray-800 flex flex-col h-full font-sans text-white">
// // // // //       <div className="flex items-center justify-between p-4 bg-[#202c33]">
// // // // //         <div className="flex items-center gap-3 overflow-hidden">
// // // // //           <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
// // // // //             <User size={20} className="text-white" />
// // // // //           </div>
// // // // //           <div className="overflow-hidden">
// // // // //             <p className="text-[9px] text-emerald-500 font-bold uppercase">My Inbox ID</p>
// // // // //             <p className="text-[10px] text-gray-400 font-mono truncate w-32">{myInboxId || "Connecting..."}</p>
// // // // //           </div>
// // // // //         </div>
// // // // //         <button className="text-gray-400 hover:text-white"><MoreVertical size={20} /></button>
// // // // //       </div>
// // // // //       <div className="p-3 border-b border-gray-800 flex gap-2">
// // // // //         <button onClick={onSendStatic} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-2">
// // // // //           <Zap size={12} /> SEND STATIC PING
// // // // //         </button>
// // // // //       </div>
// // // // //       <div className="p-3">
// // // // //         <div className="flex items-center bg-[#202c33] rounded-xl px-4 py-2 border border-transparent focus-within:border-emerald-500">
// // // // //           <Search className="text-gray-500" size={18} />
// // // // //           <input 
// // // // //             placeholder="Search Wallet or Inbox ID..." 
// // // // //             value={searchTerm} 
// // // // //             onChange={(e) => setSearchTerm(e.target.value)} 
// // // // //             onKeyDown={handleKeyPress}
// // // // //             className="bg-transparent border-none outline-none text-gray-200 text-sm ml-3 w-full"
// // // // //           />
// // // // //         </div>
// // // // //       </div>
// // // // //       <div className="flex-1 overflow-y-auto">
// // // // //         {chats?.map((chat: any) => (
// // // // //           <SidebarItem key={chat.id} chat={chat} selectedId={selectedId} setSelectedChat={setSelectedChat} />
// // // // //         ))}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // // --- 3. Chat Window Component ---
// // // // // const ChatWindow = ({ selectedChat, messages, onSend, myInboxId }: any) => {
// // // // //   const [input, setInput] = useState("");
// // // // //   const endRef = useRef<HTMLDivElement>(null);
  
// // // // //   // Resolve the ID carefully - checking if it's a function or string
// // // // //   const getPeerId = () => {
// // // // //     if (!selectedChat) return "";
// // // // //     const id = selectedChat.peerInboxId;
// // // // //     return typeof id === 'function' ? "Resolving..." : String(id);
// // // // //   };

// // // // //   const currentPeerId = getPeerId();

// // // // //   useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

// // // // //   if (!selectedChat) return (
// // // // //     <div className="flex-1 flex flex-col items-center justify-center bg-[#222e35] text-gray-500">
// // // // //       <ShieldCheck size={100} className="opacity-10 mb-4" />
// // // // //       <h2 className="text-xl font-light font-mono">SECURE NODE STANDBY</h2>
// // // // //     </div>
// // // // //   );

// // // // //   return (
// // // // //     <div className="flex-1 flex flex-col h-full bg-[#0b141a] text-white">
// // // // //       <div className="p-3 bg-[#202c33] flex items-center justify-between border-b border-gray-800">
// // // // //         <div className="flex items-center overflow-hidden">
// // // // //           <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-500 flex-shrink-0">
// // // // //              {currentPeerId.substring(0, 2).toUpperCase() || "?"}
// // // // //           </div>
// // // // //           <div className="ml-3 overflow-hidden">
// // // // //             <p className="text-xs font-mono font-bold text-gray-100 truncate w-96">
// // // // //                 {currentPeerId}
// // // // //             </p>
// // // // //             <p className="text-[10px] text-emerald-500 font-mono font-bold uppercase">
// // // // //                 Active Verified Node
// // // // //             </p>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#0b141a]" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: "overlay", backgroundSize: '400px' }}>
// // // // //         {messages?.map((m: any, i: number) => {
// // // // //           const isMe = m?.senderInboxId === myInboxId;
// // // // //           const isSystemMessage = typeof m.content !== 'string';
          
// // // // //           return (
// // // // //             <div key={m.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isSystemMessage ? 'justify-center opacity-40 my-2' : ''}`}>
// // // // //               <div className={`max-w-[70%] p-3 rounded-xl shadow-md relative ${
// // // // //                 isSystemMessage 
// // // // //                   ? 'bg-transparent border border-gray-800 text-[10px] uppercase font-mono' 
// // // // //                   : isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-gray-100 rounded-tl-none'
// // // // //               }`}>
// // // // //                 <p className="text-[14px] leading-relaxed">{isSystemMessage ? "🔒 Encrypted System Update" : m.content}</p>
// // // // //                 {!isSystemMessage && (
// // // // //                   <div className="flex justify-end items-center gap-1 mt-1 opacity-50">
// // // // //                     <span className="text-[9px]">{m?.sentAtNs ? new Date(Number(m.sentAtNs / 1000000n)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}</span>
// // // // //                     {isMe && <CheckCheck size={12} className="text-sky-400" />}
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>
// // // // //             </div>
// // // // //           );
// // // // //         })}
// // // // //         <div ref={endRef} />
// // // // //       </div>

// // // // //       <div className="p-3 bg-[#202c33] flex items-center gap-4">
// // // // //         <Smile className="text-gray-400" />
// // // // //         <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2.5">
// // // // //           <input className="w-full bg-transparent border-none outline-none text-gray-200" placeholder="Type a message" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && input.trim() && (onSend(input), setInput(""))} />
// // // // //         </div>
// // // // //         <button onClick={() => input.trim() && (onSend(input), setInput(""))} className={`p-2 rounded-full ${input.trim() ? 'bg-emerald-500' : 'bg-gray-700'}`}>
// // // // //           <Send size={22} fill={input.trim() ? "white" : "none"} />
// // // // //         </button>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // // --- 4. Main Controller ---
// // // // // export default function XMTPChat() {
// // // // //   const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
// // // // //   const [myInboxId, setMyInboxId] = useState("");
// // // // //   const [conversations, setConversations] = useState<any[]>([]);
// // // // //   const [selectedChat, setSelectedChat] = useState<any>(null);
// // // // //   const [messages, setMessages] = useState<any[]>([]);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [error, setError] = useState<string | null>(null);
// // // // //   const initRef = useRef(false);

// // // // //   // Helper to map conversations into a serializable format for React
// // // // //   const mapConversations = (list: any[]) => {
// // // // //     return list.map(c => ({
// // // // //       id: c.id,
// // // // //       instance: c,
// // // // //       // Force extraction of peerInboxId as a string immediately
// // // // //       peerInboxId: typeof c.peerInboxId === 'function' ? "Unknown" : String(c.peerInboxId)
// // // // //     }));
// // // // //   };

// // // // //   const initXMTP = async () => {
// // // // //     if (initRef.current || xmtpClient) return;
// // // // //     initRef.current = true;
// // // // //     setLoading(true);

// // // // //     try {
// // // // //       if (!window.ethereum) throw new Error("Wallet not found");
// // // // //       const provider = new ethers.BrowserProvider(window.ethereum);
// // // // //       const ethersSigner = await provider.getSigner();
// // // // //       const address = (await ethersSigner.getAddress()).toLowerCase();

// // // // //       const manualSigner = {
// // // // //         type: "EOA" as const,
// // // // //         getIdentifier: () => ({ identifier: address, identifierKind: IdentifierKind.Ethereum }),
// // // // //         signMessage: async (msg: string) => ethers.getBytes(await ethersSigner.signMessage(msg)),
// // // // //       };

// // // // //       const client = await Client.create(manualSigner, { 
// // // // //         env: "production", 
// // // // //         historySyncUrl: null 
// // // // //       });

// // // // //       setXmtpClient(client);
// // // // //       setMyInboxId(client.inboxId);

// // // // //       await client.conversations.syncAll(['allowed']);
// // // // //       const dms = await client.conversations.listDms({ consentStates: [ConsentState.Allowed] });
// // // // //       setConversations(mapConversations(dms));

// // // // //     } catch (e: any) { 
// // // // //       initRef.current = false;
// // // // //       if (e.name !== 'AbortError') setError(e.message);
// // // // //     } finally { setLoading(false); }
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     if (!xmtpClient) return;
// // // // //     let stream: any;
// // // // //     const startGlobalStream = async () => {
// // // // //       stream = await xmtpClient.conversations.streamAllMessages({
// // // // //         consentStates: [ConsentState.Allowed, ConsentState.Unknown],
// // // // //         onValue: async (msg) => {
// // // // //           const dms = await xmtpClient.conversations.listDms({ consentStates: [ConsentState.Allowed] });
// // // // //           setConversations(mapConversations(dms));
// // // // //           if (selectedChat && msg.conversationId === selectedChat.id) {
// // // // //             setMessages(prev => prev.find((existing: any) => existing.id === msg.id) ? prev : [...prev, msg]);
// // // // //           }
// // // // //         }
// // // // //       });
// // // // //     };
// // // // //     startGlobalStream();
// // // // //     return () => { if (stream) stream.end(); };
// // // // //   }, [xmtpClient, selectedChat]);

// // // // //   useEffect(() => {
// // // // //     if (!selectedChat) return;
// // // // //     (async () => {
// // // // //       try {
// // // // //         await selectedChat.sync();
// // // // //         const history = await selectedChat.messages();
// // // // //         setMessages(history || []);
// // // // //       } catch (e) { console.error(e); }
// // // // //     })();
// // // // //   }, [selectedChat]);

// // // // //   useEffect(() => { initXMTP(); }, []);

// // // // //   const handleNewChat = async (input: any) => {
// // // // //     if (!xmtpClient) return;
// // // // //     try {
// // // // //       let dm;
// // // // //       if (typeof input === 'string') {
// // // // //         dm = await xmtpClient.conversations.createDm(input);
// // // // //       } else {
// // // // //         dm = await xmtpClient.conversations.fetchDmByIdentifier(input);
// // // // //       }
// // // // //       setSelectedChat(dm);
// // // // //     } catch (e: any) {
// // // // //       alert("Identifier not found on XMTP network.");
// // // // //     }
// // // // //   };

// // // // //   if (loading) return <div className="h-screen flex items-center justify-center bg-[#0b141a] text-emerald-500 font-mono text-sm tracking-widest">AUTHENTICATING SECURE NODE...</div>;

// // // // //   return (
// // // // //     <div className="flex h-screen w-full bg-[#0b141a] overflow-hidden font-sans text-white select-none">
// // // // //       <Sidebar 
// // // // //         chats={conversations} 
// // // // //         setSelectedChat={setSelectedChat}
// // // // //         selectedId={selectedChat?.id}
// // // // //         onNewChat={handleNewChat}
// // // // //         myInboxId={myInboxId}
// // // // //         onSendStatic={() => xmtpClient?.conversations.createDm("fcf1274fbb8989f80c18766875bc9a42134360f28654d54546ccf3e901a56fe3").then(dm => dm.sendText("System Ping 📡"))}
// // // // //       />
// // // // //       <ChatWindow 
// // // // //         selectedChat={selectedChat} 
// // // // //         messages={messages} 
// // // // //         onSend={(txt: string) => selectedChat.sendText(txt)}
// // // // //         myInboxId={myInboxId}
// // // // //       />
// // // // //     </div>
// // // // //   );
// // // // // }


// // // // import React, { useState, useEffect, useRef } from "react";
// // // // import { Client, IdentifierKind, ConsentState } from "@xmtp/browser-sdk";
// // // // import { ethers } from "ethers";
// // // // import { 
// // // //   Search, MoreVertical, ShieldCheck, Send, Phone, Video, 
// // // //   User, CheckCheck, Zap, Loader2, AlertTriangle, Smile 
// // // // } from "lucide-react";

// // // // // --- 1. Sidebar Item Component ---
// // // // const SidebarItem = ({ chat, selectedId, setSelectedChat }: any) => {
// // // //   // peerInboxId is now guaranteed to be a string because we resolve it in the controller
// // // //   const pId = chat.peerInboxId;
// // // //   const shortId = pId && pId !== "Resolving..." ? pId.substring(0, 2).toUpperCase() : "ID";

// // // //   return (
// // // //     <div 
// // // //       onClick={() => setSelectedChat(chat)}
// // // //       className={`flex items-center p-4 cursor-pointer hover:bg-[#202c33] border-b border-gray-800/30 ${selectedId === chat.id ? 'bg-[#2a3942]' : ''}`}
// // // //     >
// // // //       <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-emerald-500 flex-shrink-0 text-xs">
// // // //         {shortId}
// // // //       </div>
// // // //       <div className="ml-4 flex-1 overflow-hidden">
// // // //         <p className="font-bold text-gray-100 truncate text-xs font-mono">
// // // //           {pId || "Fetching ID..."}
// // // //         </p>
// // // //         <p className="text-emerald-500 text-[9px] font-mono uppercase tracking-widest mt-1">
// // // //           {pId && pId !== "Resolving..." ? `${pId.substring(0, 6)}...${pId.substring(pId.length - 4)}` : "Verified MLS"}
// // // //         </p>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // // --- 2. Sidebar Component ---
// // // // const Sidebar = ({ chats, setSelectedChat, selectedId, onNewChat, myInboxId, onSendStatic }: any) => {
// // // //   const [searchTerm, setSearchTerm] = useState("");

// // // //   const handleKeyPress = (e: any) => {
// // // //     if (e.key === 'Enter' && searchTerm.trim()) {
// // // //       const input = searchTerm.trim();
// // // //       if (input.startsWith("0x") && input.length === 42) {
// // // //         onNewChat({ identifier: input.toLowerCase(), identifierKind: IdentifierKind.Ethereum });
// // // //       } else {
// // // //         onNewChat(input);
// // // //       }
// // // //       setSearchTerm("");
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="w-1/4 bg-[#111b21] border-r border-gray-800 flex flex-col h-full font-sans text-white">
// // // //       <div className="flex items-center justify-between p-4 bg-[#202c33]">
// // // //         <div className="flex items-center gap-3 overflow-hidden">
// // // //           <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
// // // //             <User size={20} className="text-white" />
// // // //           </div>
// // // //           <div className="overflow-hidden">
// // // //             <p className="text-[9px] text-emerald-500 font-bold uppercase">My Inbox ID</p>
// // // //             <p className="text-[10px] text-gray-400 font-mono truncate w-32">{myInboxId || "Connecting..."}</p>
// // // //           </div>
// // // //         </div>
// // // //         <button className="text-gray-400 hover:text-white"><MoreVertical size={20} /></button>
// // // //       </div>
// // // //       <div className="p-3 border-b border-gray-800 flex gap-2">
// // // //         <button onClick={onSendStatic} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-2">
// // // //           <Zap size={12} /> SEND STATIC PING
// // // //         </button>
// // // //       </div>
// // // //       <div className="p-3">
// // // //         <div className="flex items-center bg-[#202c33] rounded-xl px-4 py-2 border border-transparent focus-within:border-emerald-500">
// // // //           <Search className="text-gray-500" size={18} />
// // // //           <input 
// // // //             placeholder="Search Wallet or Inbox ID..." 
// // // //             value={searchTerm} 
// // // //             onChange={(e) => setSearchTerm(e.target.value)} 
// // // //             onKeyDown={handleKeyPress}
// // // //             className="bg-transparent border-none outline-none text-gray-200 text-sm ml-3 w-full"
// // // //           />
// // // //         </div>
// // // //       </div>
// // // //       <div className="flex-1 overflow-y-auto">
// // // //         {chats?.map((chat: any) => (
// // // //           <SidebarItem key={chat.id} chat={chat} selectedId={selectedId} setSelectedChat={setSelectedChat} />
// // // //         ))}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // // --- 3. Chat Window Component ---
// // // // const ChatWindow = ({ selectedChat, messages, onSend, myInboxId }: any) => {
// // // //   const [input, setInput] = useState("");
// // // //   const endRef = useRef<HTMLDivElement>(null);
  
// // // //   const peerId = selectedChat?.peerInboxId || "";
// // // //   const shortAvatar = peerId && peerId !== "Resolving..." ? peerId.substring(0, 2).toUpperCase() : "?";

// // // //   useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

// // // //   if (!selectedChat) return (
// // // //     <div className="flex-1 flex flex-col items-center justify-center bg-[#222e35] text-gray-500">
// // // //       <ShieldCheck size={100} className="opacity-10 mb-4" />
// // // //       <h2 className="text-xl font-light font-mono">SECURE NODE STANDBY</h2>
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <div className="flex-1 flex flex-col h-full bg-[#0b141a] text-white">
// // // //       <div className="p-3 bg-[#202c33] flex items-center justify-between border-b border-gray-800">
// // // //         <div className="flex items-center overflow-hidden">
// // // //           <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-500 flex-shrink-0">
// // // //              {shortAvatar}
// // // //           </div>
// // // //           <div className="ml-3 overflow-hidden">
// // // //             <p className="text-xs font-mono font-bold text-gray-100 truncate w-96">
// // // //                 {peerId}
// // // //             </p>
// // // //             <p className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-tighter">
// // // //                 Verified Node Session
// // // //             </p>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#0b141a]" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: "overlay", backgroundSize: '400px' }}>
// // // //         {messages?.map((m: any, i: number) => {
// // // //           const isMe = m?.senderInboxId === myInboxId;
// // // //           const isSystemMessage = typeof m.content !== 'string';
          
// // // //           return (
// // // //             <div key={m.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isSystemMessage ? 'justify-center opacity-40 my-2' : ''}`}>
// // // //               <div className={`max-w-[70%] p-3 rounded-xl shadow-md relative ${
// // // //                 isSystemMessage 
// // // //                   ? 'bg-transparent border border-gray-800 text-[10px] uppercase font-mono' 
// // // //                   : isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-gray-100 rounded-tl-none'
// // // //               }`}>
// // // //                 <p className="text-[14px] leading-relaxed">{isSystemMessage ? "🔒 Encrypted System Update" : m.content}</p>
// // // //                 {!isSystemMessage && (
// // // //                   <div className="flex justify-end items-center gap-1 mt-1 opacity-50">
// // // //                     <span className="text-[9px]">{m?.sentAtNs ? new Date(Number(m.sentAtNs / 1000000n)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}</span>
// // // //                     {isMe && <CheckCheck size={12} className="text-sky-400" />}
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           );
// // // //         })}
// // // //         <div ref={endRef} />
// // // //       </div>

// // // //       <div className="p-3 bg-[#202c33] flex items-center gap-4">
// // // //         <Smile className="text-gray-400" />
// // // //         <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2.5">
// // // //           <input className="w-full bg-transparent border-none outline-none text-gray-200" placeholder="Type a message" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && input.trim() && (onSend(input), setInput(""))} />
// // // //         </div>
// // // //         <button onClick={() => input.trim() && (onSend(input), setInput(""))} className={`p-2 rounded-full ${input.trim() ? 'bg-emerald-500' : 'bg-gray-700'}`}>
// // // //           <Send size={22} fill={input.trim() ? "white" : "none"} />
// // // //         </button>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // // --- 4. Main Controller ---
// // // // export default function XMTPChat() {
// // // //   const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
// // // //   const [myInboxId, setMyInboxId] = useState("");
// // // //   const [conversations, setConversations] = useState<any[]>([]);
// // // //   const [selectedChat, setSelectedChat] = useState<any>(null);
// // // //   const [messages, setMessages] = useState<any[]>([]);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [error, setError] = useState<string | null>(null);
// // // //   const initRef = useRef(false);

// // // //   // Helper to map and resolve async peerInboxId
// // // //   const resolveConversation = async (c: any) => {
// // // //     // 🔥 FIX: Await the peerInboxId because it's a promise in newer SDKs
// // // //     let pId = "Unknown";
// // // //     try {
// // // //       if (typeof c.peerInboxId === 'function') {
// // // //         pId = await c.peerInboxId();
// // // //       } else {
// // // //         pId = String(c.peerInboxId);
// // // //       }
// // // //     } catch (e) {
// // // //       console.warn("Could not resolve peer ID", e);
// // // //     }
    
// // // //     return {
// // // //       id: c.id,
// // // //       instance: c,
// // // //       peerInboxId: pId
// // // //     };
// // // //   };

// // // //   const initXMTP = async () => {
// // // //     if (initRef.current || xmtpClient) return;
// // // //     initRef.current = true;
// // // //     setLoading(true);

// // // //     try {
// // // //       if (!window.ethereum) throw new Error("Wallet not found");
// // // //       const provider = new ethers.BrowserProvider(window.ethereum);
// // // //       const ethersSigner = await provider.getSigner();
// // // //       const address = (await ethersSigner.getAddress()).toLowerCase();

// // // //       const manualSigner = {
// // // //         type: "EOA" as const,
// // // //         getIdentifier: () => ({ identifier: address, identifierKind: IdentifierKind.Ethereum }),
// // // //         signMessage: async (msg: string) => ethers.getBytes(await ethersSigner.signMessage(msg)),
// // // //       };

// // // //       const client = await Client.create(manualSigner, { 
// // // //         env: "production", 
// // // //         historySyncUrl: null 
// // // //       });

// // // //       setXmtpClient(client);
// // // //       setMyInboxId(client.inboxId);

// // // //       await client.conversations.syncAll(['allowed']);
// // // //       const dms = await client.conversations.listDms({ consentStates: [ConsentState.Allowed] });
      
// // // //       // Resolve all IDs before putting them into state
// // // //       const resolvedDms = await Promise.all(dms.map(resolveConversation));
// // // //       setConversations(resolvedDms);

// // // //     } catch (e: any) { 
// // // //       initRef.current = false;
// // // //       if (e.name !== 'AbortError') setError(e.message);
// // // //     } finally { setLoading(false); }
// // // //   };

// // // //   useEffect(() => {
// // // //     if (!xmtpClient) return;
// // // //     let stream: any;
// // // //     const startGlobalStream = async () => {
// // // //       stream = await xmtpClient.conversations.streamAllMessages({
// // // //         consentStates: [ConsentState.Allowed, ConsentState.Unknown],
// // // //         onValue: async (msg) => {
// // // //           const dms = await xmtpClient.conversations.listDms({ consentStates: [ConsentState.Allowed] });
// // // //           const resolved = await Promise.all(dms.map(resolveConversation));
// // // //           setConversations(resolved);
          
// // // //           if (selectedChat && msg.conversationId === selectedChat.id) {
// // // //             setMessages(prev => prev.find((existing: any) => existing.id === msg.id) ? prev : [...prev, msg]);
// // // //           }
// // // //         }
// // // //       });
// // // //     };
// // // //     startGlobalStream();
// // // //     return () => { if (stream) stream.end(); };
// // // //   }, [xmtpClient, selectedChat]);

// // // //   useEffect(() => {
// // // //     if (!selectedChat) return;
// // // //     (async () => {
// // // //       try {
// // // //         await selectedChat.instance.sync();
// // // //         const history = await selectedChat.instance.messages();
// // // //         setMessages(history || []);
// // // //       } catch (e) { console.error(e); }
// // // //     })();
// // // //   }, [selectedChat]);

// // // //   useEffect(() => { initXMTP(); }, []);

// // // //   const handleNewChat = async (input: any) => {
// // // //     if (!xmtpClient) return;
// // // //     try {
// // // //       let dm;
// // // //       if (typeof input === 'string') {
// // // //         dm = await xmtpClient.conversations.createDm(input);
// // // //       } else {
// // // //         dm = await xmtpClient.conversations.fetchDmByIdentifier(input);
// // // //       }
// // // //       // Resolve the ID for the newly created chat
// // // //       const resolved = await resolveConversation(dm);
// // // //       setSelectedChat(resolved);
// // // //     } catch (e: any) {
// // // //       alert("Identifier not found on XMTP network.");
// // // //     }
// // // //   };

// // // //   if (loading) return <div className="h-screen flex items-center justify-center bg-[#0b141a] text-emerald-500 font-mono text-sm tracking-widest animate-pulse">AUTHENTICATING SECURE NODE...</div>;

// // // //   if (error) return (
// // // //     <div className="h-screen flex flex-col items-center justify-center bg-[#0b141a] text-red-500 p-6 text-center">
// // // //       <AlertTriangle size={50} className="mb-4" />
// // // //       <p className="font-bold">{error}</p>
// // // //       <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold">RETRY</button>
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <div className="flex h-screen w-full bg-[#0b141a] overflow-hidden font-sans text-white select-none">
// // // //       <Sidebar 
// // // //         chats={conversations} 
// // // //         setSelectedChat={setSelectedChat}
// // // //         selectedId={selectedChat?.id}
// // // //         onNewChat={handleNewChat}
// // // //         myInboxId={myInboxId}
// // // //         onSendStatic={() => xmtpClient?.conversations.createDm("fcf1274fbb8989f80c18766875bc9a42134360f28654d54546ccf3e901a56fe3").then(dm => dm.sendText("System Ping 📡"))}
// // // //       />
// // // //       <ChatWindow 
// // // //         selectedChat={selectedChat} 
// // // //         messages={messages} 
// // // //         onSend={(txt: string) => selectedChat.instance.sendText(txt)}
// // // //         myInboxId={myInboxId}
// // // //       />
// // // //     </div>
// // // //   );
// // // // }



// // // import React, { useState, useEffect, useRef } from "react";
// // // import { Client, IdentifierKind, ConsentState } from "@xmtp/browser-sdk";
// // // import { ethers } from "ethers";
// // // import { 
// // //   Search, MoreVertical, ShieldCheck, Send, Phone, Video, 
// // //   User, CheckCheck, Zap, Loader2, AlertTriangle, Smile, ArrowLeft 
// // // } from "lucide-react";

// // // // --- 1. Sidebar Item Component ---
// // // const SidebarItem = ({ chat, selectedId, setSelectedChat }: any) => {
// // //   const pId = chat.peerInboxId;
// // //   const shortId = pId && pId !== "Resolving..." ? pId.substring(0, 2).toUpperCase() : "ID";

// // //   return (
// // //     <div 
// // //       onClick={() => setSelectedChat(chat)}
// // //       className={`flex items-center p-4 cursor-pointer hover:bg-[#202c33] border-b border-gray-800/30 ${selectedId === chat.id ? 'bg-[#2a3942]' : ''}`}
// // //     >
// // //       <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-emerald-500 flex-shrink-0 text-xs">
// // //         {shortId}
// // //       </div>
// // //       <div className="ml-4 flex-1 overflow-hidden">
// // //         <p className="font-bold text-gray-100 truncate text-xs font-mono">
// // //           {pId || "Fetching ID..."}
// // //         </p>
// // //         <p className="text-emerald-500 text-[9px] font-mono uppercase tracking-widest mt-1">
// // //           {pId && pId !== "Resolving..." ? `${pId.substring(0, 6)}...${pId.substring(pId.length - 4)}` : "Verified MLS"}
// // //         </p>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // --- 2. Sidebar Component ---
// // // const Sidebar = ({ chats, setSelectedChat, selectedId, onNewChat, myInboxId, onSendStatic, isMobileHidden }: any) => {
// // //   const [searchTerm, setSearchTerm] = useState("");

// // //   const handleKeyPress = (e: any) => {
// // //     if (e.key === 'Enter' && searchTerm.trim()) {
// // //       const input = searchTerm.trim();
// // //       if (input.startsWith("0x") && input.length === 42) {
// // //         onNewChat({ identifier: input.toLowerCase(), identifierKind: IdentifierKind.Ethereum });
// // //       } else {
// // //         onNewChat(input);
// // //       }
// // //       setSearchTerm("");
// // //     }
// // //   };

// // //   return (
// // //     <div className={`${isMobileHidden ? 'hidden' : 'flex'} w-full md:w-1/4 bg-[#111b21] border-r border-gray-800 flex-col h-full font-sans text-white`}>
// // //       <div className="flex items-center justify-between p-4 bg-[#202c33]">
// // //         <div className="flex items-center gap-3 overflow-hidden">
// // //           <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
// // //             <User size={20} className="text-white" />
// // //           </div>
// // //           <div className="overflow-hidden">
// // //             <p className="text-[9px] text-emerald-500 font-bold uppercase">My Inbox ID</p>
// // //             <p className="text-[10px] text-gray-400 font-mono truncate w-32">{myInboxId || "Connecting..."}</p>
// // //           </div>
// // //         </div>
// // //         <button className="text-gray-400 hover:text-white"><MoreVertical size={20} /></button>
// // //       </div>
// // //       <div className="p-3 border-b border-gray-800 flex gap-2">
// // //         <button onClick={onSendStatic} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-2">
// // //           <Zap size={12} /> <span className="hidden sm:inline">SEND STATIC PING</span><span className="sm:hidden text-[8px]">PING</span>
// // //         </button>
// // //       </div>
// // //       <div className="p-3">
// // //         <div className="flex items-center bg-[#202c33] rounded-xl px-4 py-2 border border-transparent focus-within:border-emerald-500">
// // //           <Search className="text-gray-500" size={18} />
// // //           <input 
// // //             placeholder="Search Wallet or ID..." 
// // //             value={searchTerm} 
// // //             onChange={(e) => setSearchTerm(e.target.value)} 
// // //             onKeyDown={handleKeyPress}
// // //             className="bg-transparent border-none outline-none text-gray-200 text-sm ml-3 w-full"
// // //           />
// // //         </div>
// // //       </div>
// // //       <div className="flex-1 overflow-y-auto">
// // //         {chats?.map((chat: any) => (
// // //           <SidebarItem key={chat.id} chat={chat} selectedId={selectedId} setSelectedChat={setSelectedChat} />
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // --- 3. Chat Window Component ---
// // // const ChatWindow = ({ selectedChat, messages, onSend, myInboxId, onBack, isMobileHidden }: any) => {
// // //   const [input, setInput] = useState("");
// // //   const endRef = useRef<HTMLDivElement>(null);
  
// // //   const peerId = selectedChat?.peerInboxId || "";
// // //   const shortAvatar = peerId && peerId !== "Resolving..." ? peerId.substring(0, 2).toUpperCase() : "?";

// // //   useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

// // //   if (!selectedChat) return (
// // //     <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#222e35] text-gray-500">
// // //       <ShieldCheck size={100} className="opacity-10 mb-4" />
// // //       <h2 className="text-xl font-light font-mono text-center px-4">SELECT A SECURE NODE TO START</h2>
// // //     </div>
// // //   );

// // //   return (
// // //     <div className={`${isMobileHidden ? 'hidden' : 'flex'} flex-1 flex flex-col h-full bg-[#0b141a] text-white`}>
// // //       {/* Responsive Header */}
// // //       <div className="p-3 bg-[#202c33] flex items-center justify-between border-b border-gray-800">
// // //         <div className="flex items-center overflow-hidden gap-2">
// // //           {/* Mobile Back Button */}
// // //           <button onClick={onBack} className="md:hidden p-2 hover:bg-gray-700 rounded-full">
// // //             <ArrowLeft size={20} />
// // //           </button>
          
// // //           <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-500 flex-shrink-0">
// // //              {shortAvatar}
// // //           </div>
// // //           <div className="ml-1 overflow-hidden">
// // //             <p className="text-xs font-mono font-bold text-gray-100 truncate w-40 sm:w-64 md:w-96">
// // //                 {peerId}
// // //             </p>
// // //             <p className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-tighter">
// // //                 Verified Node Session
// // //             </p>
// // //           </div>
// // //         </div>
// // //         <div className="flex space-x-3 sm:space-x-6 text-gray-400 mr-2 sm:mr-4">
// // //           <Video size={18} className="hover:text-emerald-500 cursor-pointer hidden sm:block" />
// // //           <Phone size={18} className="hover:text-emerald-500 cursor-pointer hidden sm:block" />
// // //           <MoreVertical size={20} className="hover:text-emerald-500 cursor-pointer" />
// // //         </div>
// // //       </div>

// // //       {/* Messages Area */}
// // //       <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 bg-[#0b141a]" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: "overlay", backgroundSize: '400px' }}>
// // //         {messages?.map((m: any, i: number) => {
// // //           const isMe = m?.senderInboxId === myInboxId;
// // //           const isSystemMessage = typeof m.content !== 'string';
          
// // //           return (
// // //             <div key={m.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isSystemMessage ? 'justify-center opacity-40 my-2' : ''}`}>
// // //               <div className={`max-w-[85%] md:max-w-[70%] p-3 rounded-xl shadow-md relative ${
// // //                 isSystemMessage 
// // //                   ? 'bg-transparent border border-gray-800 text-[10px] uppercase font-mono' 
// // //                   : isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-gray-100 rounded-tl-none'
// // //               }`}>
// // //                 <p className="text-[13px] md:text-[14px] leading-relaxed break-words">{isSystemMessage ? "🔒 Encrypted Update" : m.content}</p>
// // //                 {!isSystemMessage && (
// // //                   <div className="flex justify-end items-center gap-1 mt-1 opacity-50">
// // //                     <span className="text-[9px]">{m?.sentAtNs ? new Date(Number(m.sentAtNs / 1000000n)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}</span>
// // //                     {isMe && <CheckCheck size={12} className="text-sky-400" />}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           );
// // //         })}
// // //         <div ref={endRef} />
// // //       </div>

// // //       {/* Input Section */}
// // //       <div className="p-3 bg-[#202c33] flex items-center gap-2 sm:gap-4">
// // //         <Smile className="text-gray-400 shrink-0" size={20} />
// // //         <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2">
// // //           <input className="w-full bg-transparent border-none outline-none text-gray-200 text-sm" placeholder="Type a message" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && input.trim() && (onSend(input), setInput(""))} />
// // //         </div>
// // //         <button onClick={() => input.trim() && (onSend(input), setInput(""))} className={`p-2 rounded-full shrink-0 ${input.trim() ? 'bg-emerald-500' : 'bg-gray-700'}`}>
// // //           <Send size={20} fill={input.trim() ? "white" : "none"} />
// // //         </button>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // --- 4. Main Controller ---
// // // export default function XMTPChat() {
// // //   const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
// // //   const [myInboxId, setMyInboxId] = useState("");
// // //   const [conversations, setConversations] = useState<any[]>([]);
// // //   const [selectedChat, setSelectedChat] = useState<any>(null);
// // //   const [messages, setMessages] = useState<any[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const initRef = useRef(false);

// // //   const resolveConversation = async (c: any) => {
// // //     let pId = "Unknown";
// // //     try {
// // //       pId = typeof c.peerInboxId === 'function' ? await c.peerInboxId() : String(c.peerInboxId);
// // //     } catch (e) { console.warn(e); }
// // //     return { id: c.id, instance: c, peerInboxId: pId };
// // //   };

// // //   const initXMTP = async () => {
// // //     if (initRef.current || xmtpClient) return;
// // //     initRef.current = true;
// // //     setLoading(true);
// // //     try {
// // //       if (!window.ethereum) throw new Error("Wallet not found");
// // //       const provider = new ethers.BrowserProvider(window.ethereum);
// // //       const ethersSigner = await provider.getSigner();
// // //       const address = (await ethersSigner.getAddress()).toLowerCase();

// // //       const manualSigner = {
// // //         type: "EOA" as const,
// // //         getIdentifier: () => ({ identifier: address, identifierKind: IdentifierKind.Ethereum }),
// // //         signMessage: async (msg: string) => ethers.getBytes(await ethersSigner.signMessage(msg)),
// // //       };

// // //       const client = await Client.create(manualSigner, { env: "production", historySyncUrl: null });
// // //       setXmtpClient(client);
// // //       setMyInboxId(client.inboxId);
// // //       await client.conversations.syncAll(['allowed']);
// // //       const dms = await client.conversations.listDms({ consentStates: [ConsentState.Allowed] });
// // //       const resolvedDms = await Promise.all(dms.map(resolveConversation));
// // //       setConversations(resolvedDms);
// // //     } catch (e: any) { 
// // //       initRef.current = false;
// // //       if (e.name !== 'AbortError') setError(e.message);
// // //     } finally { setLoading(false); }
// // //   };

// // //   useEffect(() => {
// // //     if (!xmtpClient) return;
// // //     let stream: any;
// // //     const startGlobalStream = async () => {
// // //       stream = await xmtpClient.conversations.streamAllMessages({
// // //         consentStates: [ConsentState.Allowed, ConsentState.Unknown],
// // //         onValue: async (msg) => {
// // //           const dms = await xmtpClient.conversations.listDms({ consentStates: [ConsentState.Allowed] });
// // //           const resolved = await Promise.all(dms.map(resolveConversation));
// // //           setConversations(resolved);
// // //           if (selectedChat && msg.conversationId === selectedChat.id) {
// // //             setMessages(prev => prev.find((existing: any) => existing.id === msg.id) ? prev : [...prev, msg]);
// // //           }
// // //         }
// // //       });
// // //     };
// // //     startGlobalStream();
// // //     return () => { if (stream) stream.end(); };
// // //   }, [xmtpClient, selectedChat]);

// // //   useEffect(() => {
// // //     if (!selectedChat) return;
// // //     (async () => {
// // //       try {
// // //         await selectedChat.instance.sync();
// // //         const history = await selectedChat.instance.messages();
// // //         setMessages(history || []);
// // //       } catch (e) { console.error(e); }
// // //     })();
// // //   }, [selectedChat]);

// // //   useEffect(() => { initXMTP(); }, []);

// // //   return (
// // //     <div className="md:p-20 flex h-screen w-full bg-[#0b141a] overflow-hidden font-sans text-white select-none relative">
// // //       <Sidebar 
// // //         chats={conversations} 
// // //         setSelectedChat={setSelectedChat}
// // //         selectedId={selectedChat?.id}
// // //         onNewChat={async (input: any) => {
// // //            if (!xmtpClient) return;
// // //            const dm = typeof input === 'string' ? await xmtpClient.conversations.createDm(input) : await xmtpClient.conversations.fetchDmByIdentifier(input);
// // //            const resolved = await resolveConversation(dm);
// // //            setSelectedChat(resolved);
// // //         }}
// // //         myInboxId={myInboxId}
// // //         onSendStatic={() => xmtpClient?.conversations.createDm("fcf1274fbb8989f80c18766875bc9a42134360f28654d54546ccf3e901a56fe3").then(dm => dm.sendText("System Ping 📡"))}
// // //         // Responsive hide: hide Sidebar if a chat is selected on mobile
// // //         isMobileHidden={!!selectedChat}
// // //       />
      
// // //       <ChatWindow 
// // //         selectedChat={selectedChat} 
// // //         messages={messages} 
// // //         onSend={(txt: string) => selectedChat.instance.sendText(txt)}
// // //         myInboxId={myInboxId}
// // //         // Handle returning to list on mobile
// // //         onBack={() => setSelectedChat(null)}
// // //         // Responsive hide: hide Chat if NO chat is selected on mobile
// // //         isMobileHidden={!selectedChat}
// // //       />

// // //       {loading && (
// // //         <div className="absolute inset-0 z-50 bg-[#0b141a] flex items-center justify-center text-emerald-500 font-mono text-sm tracking-widest px-4 text-center">
// // //             AUTHENTICATING SECURE NODE...
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // import React, { useState, useEffect, useRef } from "react";
// // import { Client, IdentifierKind, ConsentState } from "@xmtp/browser-sdk";
// // import { ethers } from "ethers";
// // import { 
// //   Search, MoreVertical, ShieldCheck, Send, Phone, Video, 
// //   User, CheckCheck, Zap, Loader2, AlertTriangle, Smile, ArrowLeft 
// // } from "lucide-react";

// // // --- 1. Sidebar Item Component ---
// // const SidebarItem = ({ chat, selectedId, setSelectedChat }: any) => {
// //   const pId = chat.peerInboxId;
// //   const shortId = pId && pId !== "Resolving..." ? pId.substring(0, 2).toUpperCase() : "ID";

// //   return (
// //     <div 
// //       onClick={() => setSelectedChat(chat)}
// //       className={`flex items-center p-4 cursor-pointer hover:bg-[#202c33] border-b border-gray-800/30 ${selectedId === chat.id ? 'bg-[#2a3942]' : ''}`}
// //     >
// //       <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-emerald-500 flex-shrink-0 text-xs">
// //         {shortId}
// //       </div>
// //       <div className="ml-4 flex-1 overflow-hidden">
// //         <p className="font-bold text-gray-100 truncate text-xs font-mono">
// //           {pId || "Fetching ID..."}
// //         </p>
// //         <p className="text-emerald-500 text-[9px] font-mono uppercase tracking-widest mt-1">
// //           {pId && pId !== "Resolving..." ? `${pId.substring(0, 6)}...${pId.substring(pId.length - 4)}` : "Verified MLS"}
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // // --- 2. Sidebar Component ---
// // const Sidebar = ({ chats, setSelectedChat, selectedId, onNewChat, myInboxId, onSendStatic, showOnMobile }: any) => {
// //   const [searchTerm, setSearchTerm] = useState("");

// //   const handleKeyPress = (e: any) => {
// //     if (e.key === 'Enter' && searchTerm.trim()) {
// //       const input = searchTerm.trim();
// //       if (input.startsWith("0x") && input.length === 42) {
// //         onNewChat({ identifier: input.toLowerCase(), identifierKind: IdentifierKind.Ethereum });
// //       } else {
// //         onNewChat(input);
// //       }
// //       setSearchTerm("");
// //     }
// //   };

// //   return (
// //     <div className={`${showOnMobile ? 'flex' : 'hidden'} md:flex w-full md:w-[350px] lg:w-[400px] bg-[#111b21] border-r border-gray-800 flex-col h-full font-sans text-white flex-shrink-0`}>
// //       <div className="flex items-center justify-between p-4 bg-[#202c33]">
// //         <div className="flex items-center gap-3 overflow-hidden">
// //           <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
// //             <User size={20} className="text-white" />
// //           </div>
// //           <div className="overflow-hidden">
// //             <p className="text-[9px] text-emerald-500 font-bold uppercase">My Inbox ID</p>
// //             <p className="text-[10px] text-gray-400 font-mono truncate w-32">{myInboxId || "Connecting..."}</p>
// //           </div>
// //         </div>
// //         <button className="text-gray-400 hover:text-white"><MoreVertical size={20} /></button>
// //       </div>
// //       <div className="p-3 border-b border-gray-800 flex gap-2">
// //         <button onClick={onSendStatic} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-2">
// //           <Zap size={12} /> <span className="inline">SEND STATIC PING</span>
// //         </button>
// //       </div>
// //       <div className="p-3">
// //         <div className="flex items-center bg-[#202c33] rounded-xl px-4 py-2 border border-transparent focus-within:border-emerald-500">
// //           <Search className="text-gray-500" size={18} />
// //           <input 
// //             placeholder="Search Wallet or ID..." 
// //             value={searchTerm} 
// //             onChange={(e) => setSearchTerm(e.target.value)} 
// //             onKeyDown={handleKeyPress}
// //             className="bg-transparent border-none outline-none text-gray-200 text-sm ml-3 w-full"
// //           />
// //         </div>
// //       </div>
// //       <div className="flex-1 overflow-y-auto">
// //         {chats?.map((chat: any) => (
// //           <SidebarItem key={chat.id} chat={chat} selectedId={selectedId} setSelectedChat={setSelectedChat} />
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // // --- 3. Chat Window Component ---
// // const ChatWindow = ({ selectedChat, messages, onSend, myInboxId, onBack, showOnMobile }: any) => {
// //   const [input, setInput] = useState("");
// //   const endRef = useRef<HTMLDivElement>(null);
  
// //   const peerId = selectedChat?.peerInboxId || "";
// //   const shortAvatar = peerId && peerId !== "Resolving..." ? peerId.substring(0, 2).toUpperCase() : "?";

// //   useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

// //   if (!selectedChat) return (
// //     <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#222e35] text-gray-500 border-l border-gray-800">
// //       <ShieldCheck size={100} className="opacity-10 mb-4" />
// //       <h2 className="text-xl font-light font-mono text-center px-4 uppercase tracking-widest">Select a secure node to start</h2>
// //       <p className="text-xs mt-2 opacity-50">End-to-End Encrypted via XMTP MLS</p>
// //     </div>
// //   );

// //   return (
// //     <div className={`${showOnMobile ? 'flex' : 'hidden'} md:flex flex-1 flex flex-col h-full bg-[#0b141a] text-white`}>
// //       <div className="p-3 bg-[#202c33] flex items-center justify-between border-b border-gray-800">
// //         <div className="flex items-center overflow-hidden gap-2">
// //           {/* Back Button only on Mobile */}
// //           <button onClick={onBack} className="md:hidden p-2 hover:bg-gray-700 rounded-full text-emerald-500">
// //             <ArrowLeft size={20} />
// //           </button>
          
// //           <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-500 flex-shrink-0">
// //              {shortAvatar}
// //           </div>
// //           <div className="ml-1 overflow-hidden">
// //             <p className="text-xs font-mono font-bold text-gray-100 truncate w-40 sm:w-64 md:w-80 lg:w-96">
// //                 {peerId}
// //             </p>
// //             <p className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-tighter">
// //                 Verified Node Session
// //             </p>
// //           </div>
// //         </div>
// //         <div className="flex space-x-6 text-gray-400 mr-4">
// //           <Video size={18} className="hover:text-emerald-500 cursor-pointer hidden sm:block" />
// //           <Phone size={18} className="hover:text-emerald-500 cursor-pointer hidden sm:block" />
// //           <MoreVertical size={20} className="hover:text-emerald-500 cursor-pointer" />
// //         </div>
// //       </div>

// //       <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 bg-[#0b141a]" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: "overlay", backgroundSize: '400px' }}>
// //         {messages?.map((m: any, i: number) => {
// //           const isMe = m?.senderInboxId === myInboxId;
// //           const isSystemMessage = typeof m.content !== 'string';
          
// //           return (
// //             <div key={m.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isSystemMessage ? 'justify-center opacity-40 my-2' : ''}`}>
// //               <div className={`max-w-[85%] md:max-w-[70%] p-3 rounded-xl shadow-md relative ${
// //                 isSystemMessage 
// //                   ? 'bg-transparent border border-gray-800 text-[10px] uppercase font-mono' 
// //                   : isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-gray-100 rounded-tl-none'
// //               }`}>
// //                 <p className="text-[13px] md:text-[14px] leading-relaxed break-words whitespace-pre-wrap">{isSystemMessage ? "🔒 Encrypted Update" : m.content}</p>
// //                 {!isSystemMessage && (
// //                   <div className="flex justify-end items-center gap-1 mt-1 opacity-50">
// //                     <span className="text-[9px]">{m?.sentAtNs ? new Date(Number(m.sentAtNs / 1000000n)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}</span>
// //                     {isMe && <CheckCheck size={12} className="text-sky-400" />}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           );
// //         })}
// //         <div ref={endRef} />
// //       </div>

// //       <div className="p-3 bg-[#202c33] flex items-center gap-4">
// //         <Smile className="text-gray-400 shrink-0" size={20} />
// //         <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2">
// //           <input className="w-full bg-transparent border-none outline-none text-gray-200 text-sm" placeholder="Type a message" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && input.trim() && (onSend(input), setInput(""))} />
// //         </div>
// //         <button onClick={() => input.trim() && (onSend(input), setInput(""))} className={`p-2 rounded-full shrink-0 transition-colors ${input.trim() ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-700'}`}>
// //           <Send size={20} fill={input.trim() ? "white" : "none"} />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // // --- 4. Main Controller ---
// // export default function XMTPChat() {
// //   const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
// //   const [myInboxId, setMyInboxId] = useState("");
// //   const [conversations, setConversations] = useState<any[]>([]);
// //   const [selectedChat, setSelectedChat] = useState<any>(null);
// //   const [messages, setMessages] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const initRef = useRef(false);

// //   const resolveConversation = async (c: any) => {
// //     let pId = "Unknown";
// //     try {
// //       pId = typeof c.peerInboxId === 'function' ? await c.peerInboxId() : String(c.peerInboxId);
// //     } catch (e) { console.warn(e); }
// //     return { id: c.id, instance: c, peerInboxId: pId };
// //   };

// //   const initXMTP = async () => {
// //     if (initRef.current || xmtpClient) return;
// //     initRef.current = true;
// //     setLoading(true);
// //     try {
// //       if (!window.ethereum) throw new Error("Wallet not found");
// //       const provider = new ethers.BrowserProvider(window.ethereum);
// //       const ethersSigner = await provider.getSigner();
// //       const address = (await ethersSigner.getAddress()).toLowerCase();

// //       const manualSigner = {
// //         type: "EOA" as const,
// //         getIdentifier: () => ({ identifier: address, identifierKind: IdentifierKind.Ethereum }),
// //         signMessage: async (msg: string) => ethers.getBytes(await ethersSigner.signMessage(msg)),
// //       };

// //       const client = await Client.create(manualSigner, { env: "production", historySyncUrl: null });
// //       setXmtpClient(client);
// //       setMyInboxId(client.inboxId);
// //       await client.conversations.syncAll(['allowed']);
// //       const dms = await client.conversations.listDms({ consentStates: [ConsentState.Allowed] });
// //       const resolvedDms = await Promise.all(dms.map(resolveConversation));
// //       setConversations(resolvedDms);
// //     } catch (e: any) { 
// //       initRef.current = false;
// //       console.error(e);
// //     } finally { setLoading(false); }
// //   };

// //   useEffect(() => {
// //     if (!xmtpClient) return;
// //     let stream: any;
// //     const startGlobalStream = async () => {
// //       stream = await xmtpClient.conversations.streamAllMessages({
// //         consentStates: [ConsentState.Allowed, ConsentState.Unknown],
// //         onValue: async (msg) => {
// //           const dms = await xmtpClient.conversations.listDms({ consentStates: [ConsentState.Allowed] });
// //           const resolved = await Promise.all(dms.map(resolveConversation));
// //           setConversations(resolved);
// //           if (selectedChat && msg.conversationId === selectedChat.id) {
// //             setMessages(prev => prev.find((existing: any) => existing.id === msg.id) ? prev : [...prev, msg]);
// //           }
// //         }
// //       });
// //     };
// //     startGlobalStream();
// //     return () => { if (stream) stream.end(); };
// //   }, [xmtpClient, selectedChat]);

// //   useEffect(() => {
// //     if (!selectedChat) return;
// //     (async () => {
// //       try {
// //         await selectedChat.instance.sync();
// //         const history = await selectedChat.instance.messages();
// //         setMessages(history || []);
// //       } catch (e) { console.error(e); }
// //     })();
// //   }, [selectedChat]);

// //   useEffect(() => { initXMTP(); }, []);

// //   return (
// //     <div className="flex h-screen w-full bg-[#0b141a] overflow-hidden font-sans text-white select-none relative md:p-6 lg:p-12 xl:p-20">
// //       {/* Centered logic for Desktop like WhatsApp Web */}
// //       <div className="flex h-full w-full max-w-[1600px] mx-auto shadow-2xl overflow-hidden md:rounded-lg border border-gray-800">
        
// //         <Sidebar 
// //           chats={conversations} 
// //           setSelectedChat={setSelectedChat}
// //           selectedId={selectedChat?.id}
// //           onNewChat={async (input: any) => {
// //              if (!xmtpClient) return;
// //              const dm = typeof input === 'string' ? await xmtpClient.conversations.createDm(input) : await xmtpClient.conversations.fetchDmByIdentifier(input);
// //              const resolved = await resolveConversation(dm);
// //              setSelectedChat(resolved);
// //           }}
// //           myInboxId={myInboxId}
// //           onSendStatic={() => xmtpClient?.conversations.createDm("fcf1274fbb8989f80c18766875bc9a42134360f28654d54546ccf3e901a56fe3").then(dm => dm.sendText("System Ping 📡"))}
// //           // Mobile visibility logic: show Sidebar only if no chat is selected
// //           showOnMobile={!selectedChat}
// //         />
        
// //         <ChatWindow 
// //           selectedChat={selectedChat} 
// //           messages={messages} 
// //           onSend={(txt: string) => selectedChat.instance.sendText(txt)}
// //           myInboxId={myInboxId}
// //           onBack={() => setSelectedChat(null)}
// //           // Mobile visibility logic: show Chat only if a chat is selected
// //           showOnMobile={!!selectedChat}
// //         />
// //       </div>

// //       {loading && (
// //         <div className="absolute inset-0 z-50 bg-[#0b141a] flex flex-col items-center justify-center text-emerald-500 font-mono text-sm tracking-widest px-4 text-center">
// //             <Loader2 className="animate-spin mb-4 w-10 h-10" />
// //             AUTHENTICATING SECURE MLS NODE...
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// import React, { useState, useEffect, useRef } from "react";
// import { Client, IdentifierKind, ConsentState } from "@xmtp/browser-sdk";
// import { ethers } from "ethers";
// import { 
//   Search, MoreVertical, ShieldCheck, Send, Phone, Video, 
//   User, CheckCheck, Zap, Loader2, AlertTriangle, Smile, ArrowLeft 
// } from "lucide-react";

// // --- 1. Sidebar Item Component ---
// const SidebarItem = ({ chat, selectedId, setSelectedChat }: any) => {
//   const pId = chat.peerInboxId;
//   const shortId = pId && pId !== "Resolving..." ? pId.substring(0, 2).toUpperCase() : "ID";
//   const isUnknown = chat.consentState === ConsentState.Unknown;

//   return (
//     <div 
//       onClick={() => setSelectedChat(chat)}
//       className={`flex items-center p-4 cursor-pointer hover:bg-[#202c33] border-b border-gray-800/30 ${selectedId === chat.id ? 'bg-[#2a3942]' : ''}`}
//     >
//       <div className="relative">
//         <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-emerald-500 flex-shrink-0 text-xs">
//           {shortId}
//         </div>
//         {/* Badge for new/unknown contacts */}
//         {isUnknown && (
//           <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#111b21]"></div>
//         )}
//       </div>
//       <div className="ml-4 flex-1 overflow-hidden">
//         <p className="font-bold text-gray-100 truncate text-xs font-mono">
//           {pId || "Fetching ID..."}
//         </p>
//         <p className="text-emerald-500 text-[9px] font-mono uppercase tracking-widest mt-1 flex items-center gap-2">
//           {isUnknown ? (
//             <span className="text-blue-400 text-[8px] border border-blue-400 px-1 rounded">MESSAGE REQUEST</span>
//           ) : (
//             "Verified MLS"
//           )}
//         </p>
//       </div>
//     </div>
//   );
// };

// // --- 2. Sidebar Component ---
// const Sidebar = ({ chats, setSelectedChat, selectedId, onNewChat, myInboxId, onSendStatic, showOnMobile }: any) => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleKeyPress = (e: any) => {
//     if (e.key === 'Enter' && searchTerm.trim()) {
//       const input = searchTerm.trim();
//       if (input.startsWith("0x") && input.length === 42) {
//         onNewChat({ identifier: input.toLowerCase(), identifierKind: IdentifierKind.Ethereum });
//       } else {
//         onNewChat(input);
//       }
//       setSearchTerm("");
//     }
//   };

//   return (
//     <div className={`${showOnMobile ? 'flex' : 'hidden'} md:flex w-full md:w-[350px] lg:w-[400px] bg-[#111b21] border-r border-gray-800 flex-col h-full font-sans text-white flex-shrink-0`}>
//       <div className="flex items-center justify-between p-4 bg-[#202c33]">
//         <div className="flex items-center gap-3 overflow-hidden">
//           <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
//             <User size={20} className="text-white" />
//           </div>
//           <div className="overflow-hidden">
//             <p className="text-[9px] text-emerald-500 font-bold uppercase">My Inbox ID</p>
//             <p className="text-[10px] text-gray-400 font-mono truncate w-32">{myInboxId || "Connecting..."}</p>
//           </div>
//         </div>
//         <button className="text-gray-400 hover:text-white"><MoreVertical size={20} /></button>
//       </div>
//       <div className="p-3 border-b border-gray-800 flex gap-2">
//         <button onClick={onSendStatic} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-2">
//           <Zap size={12} /> <span className="inline">SEND STATIC PING</span>
//         </button>
//       </div>
//       <div className="p-3">
//         <div className="flex items-center bg-[#202c33] rounded-xl px-4 py-2 border border-transparent focus-within:border-emerald-500">
//           <Search className="text-gray-500" size={18} />
//           <input 
//             placeholder="Search Wallet or ID..." 
//             value={searchTerm} 
//             onChange={(e) => setSearchTerm(e.target.value)} 
//             onKeyDown={handleKeyPress}
//             className="bg-transparent border-none outline-none text-gray-200 text-sm ml-3 w-full"
//           />
//         </div>
//       </div>
//       <div className="flex-1 overflow-y-auto">
//         {chats?.length > 0 ? chats.map((chat: any) => (
//           <SidebarItem key={chat.id} chat={chat} selectedId={selectedId} setSelectedChat={setSelectedChat} />
//         )) : (
//           <div className="p-8 text-center text-gray-600 text-xs uppercase font-mono tracking-widest">No Active Sessions</div>
//         )}
//       </div>
//     </div>
//   );
// };

// // --- 3. Chat Window Component ---
// const ChatWindow = ({ selectedChat, messages, onSend, myInboxId, onBack, showOnMobile }: any) => {
//   const [input, setInput] = useState("");
//   const endRef = useRef<HTMLDivElement>(null);
  
//   const peerId = selectedChat?.peerInboxId || "";
//   const shortAvatar = peerId && peerId !== "Resolving..." ? peerId.substring(0, 2).toUpperCase() : "?";

//   useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

//   if (!selectedChat) return (
//     <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#222e35] text-gray-500 border-l border-gray-800">
//       <ShieldCheck size={100} className="opacity-10 mb-4" />
//       <h2 className="text-xl font-light font-mono text-center px-4 uppercase tracking-widest">Select a secure node</h2>
//     </div>
//   );

//   return (
//     <div className={`${showOnMobile ? 'flex' : 'hidden'} md:flex flex-1 flex flex-col h-full bg-[#0b141a] text-white`}>
//       <div className="p-3 bg-[#202c33] flex items-center justify-between border-b border-gray-800">
//         <div className="flex items-center overflow-hidden gap-2">
//           <button onClick={onBack} className="md:hidden p-2 hover:bg-gray-700 rounded-full text-emerald-500">
//             <ArrowLeft size={20} />
//           </button>
//           <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-500 flex-shrink-0">
//              {shortAvatar}
//           </div>
//           <div className="ml-1 overflow-hidden">
//             <p className="text-xs font-mono font-bold text-gray-100 truncate w-40 sm:w-64 md:w-80 lg:w-96">
//                 {peerId}
//             </p>
//             <p className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-tighter">
//                 Verified Node Session
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 bg-[#0b141a]" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: "overlay", backgroundSize: '400px' }}>
//         {messages?.map((m: any, i: number) => {
//           const isMe = m?.senderInboxId === myInboxId;
//           const isSystemMessage = typeof m.content !== 'string';
//           return (
//             <div key={m.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isSystemMessage ? 'justify-center opacity-40 my-2' : ''}`}>
//               <div className={`max-w-[85%] md:max-w-[70%] p-3 rounded-xl shadow-md relative ${
//                 isSystemMessage 
//                   ? 'bg-transparent border border-gray-800 text-[10px] uppercase font-mono' 
//                   : isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-gray-100 rounded-tl-none'
//               }`}>
//                 <p className="text-[13px] md:text-[14px] leading-relaxed break-words whitespace-pre-wrap">{isSystemMessage ? "🔒 Encrypted Update" : m.content}</p>
//                 {!isSystemMessage && (
//                   <div className="flex justify-end items-center gap-1 mt-1 opacity-50">
//                     <span className="text-[9px]">{m?.sentAtNs ? new Date(Number(m.sentAtNs / 1000000n)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}</span>
//                     {isMe && <CheckCheck size={12} className="text-sky-400" />}
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//         <div ref={endRef} />
//       </div>

//       <div className="p-3 bg-[#202c33] flex items-center gap-4">
//         <Smile className="text-gray-400 shrink-0" size={20} />
//         <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2">
//           <input className="w-full bg-transparent border-none outline-none text-gray-200 text-sm" placeholder="Type a message" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && input.trim() && (onSend(input), setInput(""))} />
//         </div>
//         <button onClick={() => input.trim() && (onSend(input), setInput(""))} className={`p-2 rounded-full shrink-0 transition-colors ${input.trim() ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-700'}`}>
//           <Send size={20} fill={input.trim() ? "white" : "none"} />
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- 4. Main Controller ---
// export default function XMTPChat() {
//   const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
//   const [myInboxId, setMyInboxId] = useState("");
//   const [conversations, setConversations] = useState<any[]>([]);
//   const [selectedChat, setSelectedChat] = useState<any>(null);
//   const [messages, setMessages] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const initRef = useRef(false);

//   // Helper to map and resolve async peerInboxId
//   const resolveConversation = async (c: any) => {
//     let pId = "Unknown";
//     let cState = ConsentState.Unknown;
//     try {
//       pId = typeof c.peerInboxId === 'function' ? await c.peerInboxId() : String(c.peerInboxId);
//       cState = await c.consentState(); // Get actual consent state
//     } catch (e) { console.warn(e); }
//     return { id: c.id, instance: c, peerInboxId: pId, consentState: cState };
//   };

//   // Logic to refresh the conversation list (including strangers/unknown)
//   const refreshConversations = async (client: Client) => {
//     // 🔥 UPDATED: Include [Allowed, Unknown] to catch new incoming messages from strangers
//     const dms = await client.conversations.listDms({ 
//       consentStates: [ConsentState.Allowed, ConsentState.Unknown] 
//     });
//     const resolvedDms = await Promise.all(dms.map(resolveConversation));
//     setConversations(resolvedDms);
//   };

//   const initXMTP = async () => {
//     if (initRef.current || xmtpClient) return;
//     initRef.current = true;
//     setLoading(true);
//     try {
//       if (!window.ethereum) throw new Error("Wallet not found");
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const ethersSigner = await provider.getSigner();
//       const address = (await ethersSigner.getAddress()).toLowerCase();

//       const manualSigner = {
//         type: "EOA" as const,
//         getIdentifier: () => ({ identifier: address, identifierKind: IdentifierKind.Ethereum }),
//         signMessage: async (msg: string) => ethers.getBytes(await ethersSigner.signMessage(msg)),
//       };

//       const client = await Client.create(manualSigner, { env: "production", historySyncUrl: null });
//       setXmtpClient(client);
//       setMyInboxId(client.inboxId);
      
//       await client.conversations.syncAll(['allowed', 'unknown']);
//       await refreshConversations(client);
//     } catch (e: any) { 
//       initRef.current = false;
//       console.error(e);
//     } finally { setLoading(false); }
//   };

//   useEffect(() => {
//     if (!xmtpClient) return;
//     let stream: any;
//     const startGlobalStream = async () => {
//       stream = await xmtpClient.conversations.streamAllMessages({
//         // 🔥 Listen for messages from both known and unknown senders
//         consentStates: [ConsentState.Allowed, ConsentState.Unknown],
//         onValue: async (msg) => {
//           // Refresh list so new strangers appear immediately
//           await refreshConversations(xmtpClient);
          
//           if (selectedChat && msg.conversationId === selectedChat.id) {
//             setMessages(prev => prev.find((existing: any) => existing.id === msg.id) ? prev : [...prev, msg]);
//           }
//         }
//       });
//     };
//     startGlobalStream();
//     return () => { if (stream) stream.end(); };
//   }, [xmtpClient, selectedChat]);

//   useEffect(() => {
//     if (!selectedChat) return;
//     (async () => {
//       try {
//         await selectedChat.instance.sync();
//         const history = await selectedChat.instance.messages();
//         setMessages(history || []);
        
//         // Auto-allow if we send a message (standard XMTP logic)
//         const currentConsent = await selectedChat.instance.consentState();
//         if (currentConsent === ConsentState.Unknown) {
//             // Optional: User can choose to allow. For now, we just list them.
//         }
//       } catch (e) { console.error(e); }
//     })();
//   }, [selectedChat]);

//   useEffect(() => { initXMTP(); }, []);

//   const handleNewChat = async (input: any) => {
//     if (!xmtpClient) return;
//     try {
//       let dm = typeof input === 'string' 
//         ? await xmtpClient.conversations.createDm(input) 
//         : await xmtpClient.conversations.fetchDmByIdentifier(input);
      
//       const resolved = await resolveConversation(dm);
//       setSelectedChat(resolved);
//       await refreshConversations(xmtpClient);
//     } catch (e) { alert("Not found on XMTP."); }
//   };

//   return (
//     <div className="flex h-screen w-full bg-[#0b141a] overflow-hidden font-sans text-white select-none relative md:p-6 lg:p-12 xl:p-20">
//       <div className="flex h-full w-full max-w-[1600px] mx-auto shadow-2xl overflow-hidden md:rounded-lg border border-gray-800">
//         <Sidebar 
//           chats={conversations} 
//           setSelectedChat={setSelectedChat}
//           selectedId={selectedChat?.id}
//           onNewChat={handleNewChat}
//           myInboxId={myInboxId}
//           onSendStatic={() => xmtpClient?.conversations.createDm("fcf1274fbb8989f80c18766875bc9a42134360f28654d54546ccf3e901a56fe3").then(dm => dm.sendText("System Ping 📡"))}
//           showOnMobile={!selectedChat}
//         />
//         <ChatWindow 
//           selectedChat={selectedChat} 
//           messages={messages} 
//           onSend={(txt: string) => selectedChat.instance.sendText(txt)}
//           myInboxId={myInboxId}
//           onBack={() => setSelectedChat(null)}
//           showOnMobile={!!selectedChat}
//         />
//       </div>
//       {loading && (
//         <div className="absolute inset-0 z-50 bg-[#0b141a] flex flex-col items-center justify-center text-emerald-500 font-mono text-sm tracking-widest px-4 text-center">
//             <Loader2 className="animate-spin mb-4 w-10 h-10" />
//             AUTHENTICATING SECURE MLS NODE...
//         </div>
//       )}
//     </div>
//   );
// }


// ... (imports remain the same)
// ... (imports remain the same)

// --- 3. Chat Window Component ---
import React, { useState, useEffect, useRef } from "react";
import { Client, IdentifierKind, ConsentState } from "@xmtp/browser-sdk";
import { ethers } from "ethers";
import { 
  Search, MoreVertical, ShieldCheck, Send, Phone, Video, 
  User, CheckCheck, Zap, Loader2, AlertTriangle, Smile, ArrowLeft 
} from "lucide-react";

// --- 1. Sidebar Item Component ---
const SidebarItem = ({ chat, selectedId, setSelectedChat }: any) => {
  const pId = chat.peerInboxId;
  const shortId = pId && pId !== "Resolving..." ? pId.substring(0, 2).toUpperCase() : "ID";
  const isUnknown = chat.consentState === ConsentState.Unknown;

  return (
    <div 
      onClick={() => setSelectedChat(chat)}
      className={`flex items-center p-4 cursor-pointer hover:bg-[#202c33] border-b border-gray-800/30 ${selectedId === chat.id ? 'bg-[#2a3942]' : ''}`}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-emerald-500 flex-shrink-0 text-xs">
          {shortId}
        </div>
        {isUnknown && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#111b21]"></div>
        )}
      </div>
      <div className="ml-4 flex-1 overflow-hidden">
        <p className="font-bold text-gray-100 truncate text-xs font-mono">
          {pId || "Fetching ID..."}
        </p>
        <p className="text-emerald-500 text-[9px] font-mono uppercase tracking-widest mt-1 flex items-center gap-2">
          {isUnknown ? (
            <span className="text-blue-400 text-[8px] border border-blue-400 px-1 rounded">MESSAGE REQUEST</span>
          ) : chat.isActive ? (
            "Verified MLS"
          ) : (
            <span className="text-gray-500">ACTIVATING...</span>
          )}
        </p>
      </div>
    </div>
  );
};

// --- 2. Sidebar Component ---
const Sidebar = ({ chats, setSelectedChat, selectedId, onNewChat, myInboxId, showOnMobile }: any) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      const input = searchTerm.trim();
      if (input.startsWith("0x") && input.length === 42) {
        onNewChat({ identifier: input.toLowerCase(), identifierKind: IdentifierKind.Ethereum });
      } else {
        onNewChat(input);
      }
      setSearchTerm("");
    }
  };

  return (
    <div className={`${showOnMobile ? 'flex' : 'hidden'} md:flex w-full md:w-[350px] lg:w-[400px] bg-[#111b21] border-r border-gray-800 flex-col h-full font-sans text-white flex-shrink-0`}>
      <div className="flex items-center justify-between p-4 bg-[#202c33]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <User size={20} className="text-white" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[9px] text-emerald-500 font-bold uppercase">My Inbox ID</p>
            <p className="text-[10px] text-gray-400 font-mono truncate w-32">{myInboxId || "Connecting..."}</p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white"><MoreVertical size={20} /></button>
      </div>
      <div className="p-3">
        <div className="flex items-center bg-[#202c33] rounded-xl px-4 py-2 border border-transparent focus-within:border-emerald-500">
          <Search className="text-gray-500" size={18} />
          <input 
            placeholder="Search Wallet or ID..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            onKeyDown={handleKeyPress}
            className="bg-transparent border-none outline-none text-gray-200 text-sm ml-3 w-full"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats?.length > 0 ? chats.map((chat: any) => (
          <SidebarItem key={chat.id} chat={chat} selectedId={selectedId} setSelectedChat={setSelectedChat} />
        )) : (
          <div className="p-8 text-center text-gray-600 text-xs uppercase font-mono tracking-widest">No Active Sessions</div>
        )}
      </div>
    </div>
  );
};

// --- 3. Chat Window Component ---
const ChatWindow = ({ selectedChat, messages, onSend, myInboxId, onBack, showOnMobile, isChatLoading }: any) => {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  
  const peerId = selectedChat?.peerInboxId || "";
  const shortAvatar = peerId && peerId !== "Resolving..." ? peerId.substring(0, 2).toUpperCase() : "?";

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  if (!selectedChat) return (
    <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#222e35] text-gray-500 border-l border-gray-800">
      <ShieldCheck size={100} className="opacity-10 mb-4" />
      <h2 className="text-xl font-light font-mono text-center px-4 uppercase tracking-widest">Select a secure node</h2>
    </div>
  );

  return (
    <div className={`${showOnMobile ? 'flex' : 'hidden'} md:flex flex-1 flex flex-col h-full bg-[#0b141a] text-white`}>
      <div className="p-3 bg-[#202c33] flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center overflow-hidden gap-2">
          <button onClick={onBack} className="md:hidden p-2 hover:bg-gray-700 rounded-full text-emerald-500">
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center font-bold text-emerald-500 flex-shrink-0">
             {shortAvatar}
          </div>
          <div className="ml-1 overflow-hidden">
            <p className="text-xs font-mono font-bold text-gray-100 truncate w-40 sm:w-64 md:w-80 lg:w-96">
                {peerId}
            </p>
            <p className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-tighter">
                {isChatLoading ? "Synchronizing State..." : "Verified Node Session"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 bg-[#0b141a]" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: "overlay", backgroundSize: '400px' }}>
        
        {/* Guard for Inactive Group */}
        {!selectedChat.isActive && !isChatLoading && (
           <div className="flex justify-center my-6">
             <div className="bg-[#202c33] p-4 rounded-lg border border-blue-500/30 text-center max-w-xs shadow-xl">
               <ShieldCheck className="text-blue-400 mx-auto mb-2" size={24} />
               <p className="text-xs font-mono text-gray-300">This node is pending activation. Send a message to initialize the secure bridge.</p>
             </div>
           </div>
        )}

        {messages?.map((m: any, i: number) => {
          const isMe = m?.senderInboxId === myInboxId;
          const isSystemMessage = typeof m.content !== 'string';
          return (
            <div key={m.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isSystemMessage ? 'justify-center opacity-40 my-2' : ''}`}>
              <div className={`max-w-[85%] md:max-w-[70%] p-3 rounded-xl shadow-md relative ${
                isSystemMessage 
                  ? 'bg-transparent border border-gray-800 text-[10px] uppercase font-mono' 
                  : isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-gray-100 rounded-tl-none'
              }`}>
                <p className="text-[13px] md:text-[14px] leading-relaxed break-words whitespace-pre-wrap">{isSystemMessage ? "🔒 Encrypted Update" : m.content}</p>
                {!isSystemMessage && (
                  <div className="flex justify-end items-center gap-1 mt-1 opacity-50">
                    <span className="text-[9px]">{m?.sentAtNs ? new Date(Number(m.sentAtNs / 1000000n)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}</span>
                    {isMe && <CheckCheck size={12} className="text-sky-400" />}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="p-3 bg-[#202c33] flex items-center gap-4">
        <Smile className="text-gray-400 shrink-0" size={20} />
        <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2">
          <input className="w-full bg-transparent border-none outline-none text-gray-200 text-sm" placeholder="Type a message" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && input.trim() && (onSend(input), setInput(""))} />
        </div>
        <button onClick={() => input.trim() && (onSend(input), setInput(""))} className={`p-2 rounded-full shrink-0 transition-colors ${input.trim() ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-700'}`}>
          <Send size={20} fill={input.trim() ? "white" : "none"} />
        </button>
      </div>
    </div>
  );
};

// --- 4. Main Controller ---
export default function XMTPChat() {
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [myInboxId, setMyInboxId] = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const initRef = useRef(false);

  // Helper to safely wrap conversation object
  const resolveConversation = async (c: any) => {
    let pId = "Unknown";
    let cState = ConsentState.Unknown;
    let active = false;
    try {
      pId = typeof c.peerInboxId === 'function' ? await c.peerInboxId() : String(c.peerInboxId);
      cState = await c.consentState();
      active = await c.isActive(); 
    } catch (e) { console.warn(e); }
    return { id: c.id, instance: c, peerInboxId: pId, consentState: cState, isActive: active };
  };

  const refreshConversations = async (client: Client) => {
    const dms = await client.conversations.listDms({ 
      consentStates: [ConsentState.Allowed, ConsentState.Unknown] 
    });
    const resolvedDms = await Promise.all(dms.map(resolveConversation));
    setConversations(resolvedDms);
  };

  const initXMTP = async () => {
    if (initRef.current || xmtpClient) return;
    initRef.current = true;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const ethersSigner = await provider.getSigner();
      const address = (await ethersSigner.getAddress()).toLowerCase();

      const manualSigner = {
        type: "EOA" as const,
        getIdentifier: () => ({ identifier: address, identifierKind: IdentifierKind.Ethereum }),
        signMessage: async (msg: string) => ethers.getBytes(await ethersSigner.signMessage(msg)),
      };

      const client = await Client.create(manualSigner, { env: "production", historySyncUrl: null });
      setXmtpClient(client);
      setMyInboxId(client.inboxId);
      
      await client.conversations.syncAll(['allowed', 'unknown']);
      await refreshConversations(client);
    } catch (e) { 
      initRef.current = false;
      console.error(e);
    } finally { setLoading(false); }
  };

  // Sync and Message Load Logic
  useEffect(() => {
    if (!selectedChat) return;
    let isCancelled = false;

    (async () => {
      setIsChatLoading(true);
      try {
        const convo = selectedChat.instance;
        
        // 🔥 FIX: Only sync if group is cryptographically active for this client
        const active = await convo.isActive();
        if (active) {
            await convo.sync();
        }

        const history = await convo.messages();
        if (!isCancelled) setMessages(history || []);
      } catch (e: any) { 
        console.error("Chat sync error:", e);
        // Fallback: Show local messages even if network sync fails
        const history = await selectedChat.instance.messages();
        if (!isCancelled) setMessages(history || []);
      } finally {
        if (!isCancelled) setIsChatLoading(false);
      }
    })();

    return () => { isCancelled = true; };
  }, [selectedChat?.id]);

  // Global Stream for incoming messages
  useEffect(() => {
    if (!xmtpClient) return;
    let stream: any;
    const startGlobalStream = async () => {
      stream = await xmtpClient.conversations.streamAllMessages({
        consentStates: [ConsentState.Allowed, ConsentState.Unknown],
        onValue: async (msg) => {
          await refreshConversations(xmtpClient);
          if (selectedChat && msg.conversationId === selectedChat.id) {
            setMessages(prev => prev.find((existing: any) => existing.id === msg.id) ? prev : [...prev, msg]);
          }
        }
      });
    };
    startGlobalStream();
    return () => { if (stream) stream.end(); };
  }, [xmtpClient, selectedChat?.id]);

  useEffect(() => { initXMTP(); }, []);

  const handleSend = async (text: string) => {
    if (!selectedChat) return;
    try {
      // Sending often triggers the handshake that activates a group
      await selectedChat.instance.sendText(text);
      const history = await selectedChat.instance.messages();
      setMessages(history);
      
      // If it was inactive, update the status locally
      if (!selectedChat.isActive) {
        const updated = await resolveConversation(selectedChat.instance);
        setSelectedChat(updated);
        if (xmtpClient) refreshConversations(xmtpClient);
      }
    } catch (e: any) {
      console.error("Send failed:", e);
      if (e.message.includes("inactive")) {
        alert("Node pending activation. Please wait or try again in a moment.");
      }
    }
  };

  const handleNewChat = async (input: any) => {
    if (!xmtpClient) return;
    try {
      let dm = typeof input === 'string' 
        ? await xmtpClient.conversations.createDm(input) 
        : await xmtpClient.conversations.fetchDmByIdentifier(input);
      
      const resolved = await resolveConversation(dm);
      setSelectedChat(resolved);
      await refreshConversations(xmtpClient);
    } catch (e) { alert("Inbox ID or Address not found on XMTP Network."); }
  };

  return (
    <div className="flex h-screen w-full bg-[#0b141a] overflow-hidden font-sans text-white select-none relative md:p-6 lg:p-12 xl:p-20">
      <div className="flex h-full w-full max-w-[1600px] mx-auto shadow-2xl overflow-hidden md:rounded-lg border border-gray-800">
        <Sidebar 
          chats={conversations} 
          setSelectedChat={setSelectedChat}
          selectedId={selectedChat?.id}
          onNewChat={handleNewChat}
          myInboxId={myInboxId}
          showOnMobile={!selectedChat}
        />
        <ChatWindow 
          selectedChat={selectedChat} 
          messages={messages} 
          onSend={handleSend}
          myInboxId={myInboxId}
          onBack={() => setSelectedChat(null)}
          showOnMobile={!!selectedChat}
          isChatLoading={isChatLoading}
        />
      </div>
      {loading && (
        <div className="absolute inset-0 z-50 bg-[#0b141a] flex flex-col items-center justify-center text-emerald-500 font-mono text-sm tracking-widest px-4 text-center">
            <Loader2 className="animate-spin mb-4 w-10 h-10" />
            AUTHENTICATING SECURE MLS NODE...
        </div>
      )}
    </div>
  );
}