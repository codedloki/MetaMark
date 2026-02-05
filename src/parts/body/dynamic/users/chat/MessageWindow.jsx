import React, { useEffect, useRef } from "react";
import { 
  User, 
  ExternalLink, 
  ShieldCheck, 
  MoreHorizontal, 
  Lock,
  ArrowDown
} from "lucide-react";

const MessageWindow = ({ selectedChat, messages, myAddress }) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!selectedChat) return null;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fcfdfe] overflow-hidden">
      
      {/* === Chat Header === */}
      <div className="p-4 md:p-6 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <User size={24} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                {selectedChat.address.substring(0, 8)}...{selectedChat.address.slice(-6)}
              </h3>
              <a 
                href={`https://polygonscan.com/address/${selectedChat.address}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                <ExternalLink size={14} />
              </a>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck size={12} className="text-blue-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Peer Verified via XMTP
              </span>
            </div>
          </div>
        </div>

        <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* === Messages Area === */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth scrollbar-thin scrollbar-thumb-slate-200"
      >
        {/* Encryption Notice */}
        <div className="flex justify-center my-4">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100/50 rounded-full border border-slate-200/50">
            <Lock size={10} className="text-slate-400" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">
              Messages are End-to-End Encrypted
            </span>
          </div>
        </div>

        {messages.map((msg, index) => {
          const isMe = msg.senderAddress.toLowerCase() === myAddress.toLowerCase();
          
          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"} group animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%] md:max-w-[70%]`}>
                
                {/* Bubble */}
                <div className={`relative p-4 rounded-[2rem] text-sm font-bold shadow-sm leading-relaxed
                  ${isMe 
                    ? "bg-blue-600 text-white rounded-tr-none shadow-blue-200" 
                    : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"}
                `}>
                  {msg.content}
                </div>

                {/* Metadata (Time + Status) */}
                <div className={`flex items-center gap-2 mt-2 px-2`}>
                  <span className="text-[9px] font-black text-slate-300 uppercase">
                    {new Date(msg.sent).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    <div className="flex items-center gap-0.5">
                      <ShieldCheck size={10} className="text-blue-400" />
                      <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter italic">Secured</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll to Bottom Shortcut (Floating) */}
      <div className="absolute bottom-32 right-8 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
        <button className="p-2 bg-white shadow-xl border border-slate-100 rounded-full text-slate-400 pointer-events-auto active:scale-90 transition-transform">
          <ArrowDown size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageWindow;