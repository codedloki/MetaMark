import React, { useRef, useEffect, useState } from "react";
import { Box, TextField, IconButton, Typography, Avatar } from "@mui/material";
// 🔥 Lucide Icons
import { Send, ShieldCheck, MoreVertical, Phone, Video, Paperclip, Smile } from "lucide-react";

export default function ChatWindow({ selectedChat, messages, onSend, myAddress }) {
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#222e35] text-gray-500 select-none">
        <div className="bg-[#2a3942] p-8 rounded-full mb-6 animate-pulse">
           <ShieldCheck size={80} strokeWidth={1} className="text-[#00a884] opacity-40" />
        </div>
        <h2 className="text-xl font-light text-gray-300 tracking-tight">MetaMark Secure Messenger</h2>
        <p className="mt-2 text-[10px] uppercase tracking-[0.4em] font-black opacity-30 text-center max-w-xs leading-relaxed">
          End-to-End Encrypted <br/> Powered by XMTP Network
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b141a] relative">
      {/* Header */}
      <div className="p-3 bg-[#202c33] flex items-center justify-between shadow-md z-10">
        <div className="flex items-center">
          <Avatar sx={{ width: 40, height: 40, bgcolor: '#3d4b53' }}>
            {selectedChat.peerAddress.substring(2, 4).toUpperCase()}
          </Avatar>
          <div className="ml-4">
            <Typography variant="subtitle2" sx={{ color: '#e9edef', fontApex: 'mono', fontSize: '0.9rem' }}>
              {selectedChat.peerAddress.substring(0, 12)}...
            </Typography>
            <Typography variant="caption" sx={{ color: '#00a884', fontWeight: 'bold' }}>Secure Node</Typography>
          </div>
        </div>
        <div className="flex space-x-4 text-gray-400 mr-2">
          <Video size={20} className="cursor-pointer hover:text-white transition-colors" />
          <Phone size={20} className="cursor-pointer hover:text-white transition-colors" />
          <MoreVertical size={20} className="cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar" 
           style={{ 
             backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", 
             backgroundRepeat: 'repeat',
             backgroundSize: '400px',
             backgroundColor: '#0b141a'
           }}>
        {messages.map((m, i) => {
          const isMe = m.senderAddress.toLowerCase() === myAddress?.toLowerCase();
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[75%] p-2.5 px-4 rounded-xl shadow-sm relative ${
                isMe ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none' : 'bg-[#202c33] text-[#e9edef] rounded-tl-none'
              }`}>
                <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{m.content}</Typography>
                <div className="flex justify-end mt-1">
                   <Typography variant="caption" sx={{ fontSize: '9px', opacity: 0.5 }}>
                     {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </Typography>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-[#202c33] flex items-center space-x-3">
        <IconButton className="text-gray-400"><Smile size={24} /></IconButton>
        <IconButton className="text-gray-400"><Paperclip size={22} /></IconButton>
        <div className="flex-1 bg-[#2a3942] rounded-xl px-4 py-2">
          <input
            type="text"
            placeholder="Type a message"
            className="w-full bg-transparent border-none outline-none text-gray-200 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>
        <IconButton 
          onClick={handleSend} 
          disabled={!input.trim()} 
          sx={{ 
            bgcolor: input.trim() ? "#00a884" : "transparent", 
            color: "white", 
            "&:hover": { bgcolor: "#008f6f" },
            transition: 'all 0.2s'
          }}
        >
          <Send size={20} fill={input.trim() ? "currentColor" : "none"} />
        </IconButton>
      </div>
    </div>
  );
}