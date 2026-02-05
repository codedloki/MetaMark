import React, { useState } from "react";
import { Search, Plus, ListFilter, CheckCircle2, Loader2 } from "lucide-react";

const ConversationList = ({ conversations, onSelect, selectedId, onNewChat, isSearching }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.length === 42) {
      onNewChat(searchTerm);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f8fafc] border-r border-slate-200/60">
      <div className="p-6 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">Inbox</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">XMTP Secured</p>
          </div>
          <div className="h-10 w-10 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-center">
            <Plus size={20} />
          </div>
        </div>

        {/* Search & New Chat Input */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {isSearching ? <Loader2 className="animate-spin text-blue-600" size={16}/> : <Search className="text-slate-400" size={16} />}
          </div>
          <input 
            type="text" 
            placeholder="Paste address & press Enter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full bg-white border border-slate-200 py-3.5 pl-10 pr-4 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-300 font-mono"
          />
        </div>
        <p className="text-[8px] text-slate-400 font-bold uppercase mt-2 ml-1 tracking-wider">
          {isSearching ? "Verifying Peer on XMTP..." : "Enter 0x address to start new chat"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 scrollbar-hide">
        {conversations.map((chat) => (
          <button 
            key={chat.id}
            onClick={() => onSelect(chat)}
            className={`w-full flex items-center gap-4 p-4 rounded-[1.8rem] transition-all duration-300
              ${selectedId === chat.id ? 'bg-white shadow-xl border border-slate-100 ring-1 ring-blue-500/5' : 'hover:bg-white/60'}`}
          >
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center text-white font-black text-xs shadow-inner`}>
              {chat.address.substring(2, 4).toUpperCase()}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <span className={`text-[11px] font-black tracking-tight font-mono ${selectedId === chat.id ? 'text-blue-600' : 'text-slate-800'}`}>
                {chat.address.substring(0, 6)}...{chat.address.slice(-4)}
              </span>
              <p className="text-[10px] truncate font-bold text-slate-400">Encrypted P2P Session</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;