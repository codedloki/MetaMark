import React from "react";
import { Avatar, IconButton } from "@mui/material";
// 🔥 Lucide Icons
import { Search, MoreVertical, UserPlus, Users, Printer, Share2, Plus } from "lucide-react";

export default function Sidebar({ chats, setSelectedChat, selectedId, onNewChat, isSearching }) {
  return (
    <div className="w-1/4 bg-[#111b21] border-r border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-[#202c33]">
        <Avatar sx={{ bgcolor: "#00a884", fontWeight: 'bold' }}>P</Avatar>
        <div className="flex space-x-1 text-gray-400">
          <IconButton color="inherit" size="small"><Users size={20} /></IconButton>
          <IconButton color="inherit" size="small"><MoreVertical size={20} /></IconButton>
        </div>
      </div>

      {/* Search / Add Peer */}
      <div className="p-3">
        <div className="flex items-center bg-[#202c33] rounded-xl px-3 py-2 border border-transparent focus-within:border-[#00a884] transition-all">
          <Search className="text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search or paste address..."
            className="bg-transparent border-none outline-none text-white text-sm ml-3 w-full placeholder:text-gray-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.length === 42) {
                onNewChat(e.target.value);
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-10 p-4 text-center">
            <div className="bg-[#202c33] p-4 rounded-full mb-3">
               <UserPlus className="text-gray-600" size={32} />
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">No active sessions</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.instance)}
              className={`flex items-center p-4 cursor-pointer hover:bg-[#202c33] border-b border-gray-800/30 transition-all ${selectedId === chat.id ? 'bg-[#2a3942]' : ''}`}
            >
              <div className="relative">
                <Avatar sx={{ bgcolor: "#005c4b", width: 48, height: 48, fontSize: '1rem' }}>
                  {chat.address.substring(2, 4).toUpperCase()}
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#111b21] rounded-full"></div>
              </div>
              <div className="ml-4 flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                   <p className="font-bold text-gray-100 truncate font-mono text-[13px]">
                     {chat.address.substring(0, 6)}...{chat.address.slice(-4)}
                   </p>
                   <span className="text-[10px] text-gray-500">Live</span>
                </div>
                <p className="text-gray-500 text-xs truncate">Encrypted P2P Session</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}