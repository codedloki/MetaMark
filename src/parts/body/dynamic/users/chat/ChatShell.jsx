import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Send, 
  ShieldCheck, 
  User, 
  MessageSquare,
  ArrowLeft,
  Info
} from "lucide-react";

// Mock Data for UI Testing (Ise XMTP hooks se replace karenge baad mein)
const MOCK_CONVERSATIONS = [
  { id: 1, address: "0x71C...4E1a", lastMsg: "Batch #102 details verified", time: "2m ago", unread: true },
  { id: 2, address: "0x3A2...9B4c", lastMsg: "Is the product available?", time: "1h ago", unread: false },
  { id: 3, address: "0x9F1...2D8e", lastMsg: "Thank you for the support", time: "Yesterday", unread: false },
];

export default function ChatShell() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputMsg, setInputMsg] = useState("");

  return (
    <div className="h-screen w-full bg-[#f1f5f9] flex items-center justify-center p-0 md:p-6 font-sans">
      {/* --- Main Chat Container --- */}
      <div className="w-full max-w-6xl h-full md:h-[90vh] bg-white md:rounded-[2.5rem] shadow-2xl flex overflow-hidden border border-slate-200">
        
        {/* === Sidebar: Conversation List === */}
        <div className={`w-full md:w-80 flex-shrink-0 border-r border-slate-100 flex flex-col bg-slate-50/50 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {/* Sidebar Header */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">Messages</h1>
              <button className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all">
                <Plus size={20} />
              </button>
            </div>
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search wallet..."
                className="w-full bg-white border border-slate-200 py-3 pl-10 pr-4 rounded-2xl text-xs font-bold outline-none focus:ring-2 ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto px-3 space-y-2 scrollbar-hide">
            {MOCK_CONVERSATIONS.map((chat) => (
              <button 
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full flex items-center gap-4 p-4 rounded-[1.5rem] transition-all ${selectedChat?.id === chat.id ? 'bg-white shadow-md border border-slate-100' : 'hover:bg-slate-100/50'}`}
              >
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-inner">
                  {chat.address.substring(2, 4).toUpperCase()}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-black text-slate-800">{chat.address}</span>
                    <span className="text-[9px] font-bold text-slate-400">{chat.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold truncate">{chat.lastMsg}</p>
                </div>
                {chat.unread && <div className="w-2 h-2 bg-blue-600 rounded-full shadow-lg shadow-blue-200" />}
              </button>
            ))}
          </div>
        </div>

        {/* === Main Window: Messaging Area === */}
        <div className={`flex-1 flex flex-col bg-white relative ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 md:p-6 border-b border-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 text-slate-400"><ArrowLeft size={20}/></button>
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white"><User size={20}/></div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{selectedChat.address}</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-blue-600">Secure XMTP Link</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><Info size={20}/></button>
                  <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"><MoreVertical size={20}/></button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-slate-50/30">
                {/* Peer Message */}
                <div className="flex justify-start">
                  <div className="max-w-[80%] bg-white border border-slate-100 p-4 rounded-[1.8rem] rounded-tl-none shadow-sm">
                    <p className="text-xs font-bold text-slate-700 leading-relaxed italic">Hello! I scanned Batch #102. Can you confirm the manufacturer origin?</p>
                    <span className="text-[9px] text-slate-300 font-bold mt-2 block">10:45 AM</span>
                  </div>
                </div>

                {/* Manufacturer Message */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-blue-600 p-4 rounded-[1.8rem] rounded-tr-none shadow-xl shadow-blue-100">
                    <p className="text-xs font-bold text-white leading-relaxed">Yes, Batch #102 is verified on Polygon. The Merkle root is signed by our official wallet.</p>
                    <span className="text-[9px] text-blue-200 font-bold mt-2 block text-right font-mono">ENCRYPTED</span>
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <div className="p-6 bg-white">
                <form 
                  onSubmit={(e) => { e.preventDefault(); setInputMsg(""); }}
                  className="flex items-center gap-3 bg-slate-100/50 p-2 rounded-[2rem] border border-slate-200/50 focus-within:ring-2 ring-blue-500/20 transition-all"
                >
                  <input 
                    type="text" 
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="Type encrypted message..."
                    className="flex-1 bg-transparent border-none outline-none py-3 px-4 text-xs font-bold text-slate-800"
                  />
                  <button className="bg-slate-900 text-white p-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg">
                    <Send size={18} />
                  </button>
                </form>
                <p className="text-[8px] text-center text-slate-400 font-bold uppercase tracking-[0.2em] mt-4">
                  <ShieldCheck size={10} className="inline mr-1 mb-0.5" /> End-to-End Encrypted via XMTP Protocol
                </p>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 border border-slate-100">
                <MessageSquare className="text-slate-200" size={48} />
              </div>
              <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Web3 Communication</h2>
              <p className="max-w-xs text-xs text-slate-400 font-bold mt-2 leading-relaxed">
                Connect with customers and partners through the decentralized XMTP messaging network.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}