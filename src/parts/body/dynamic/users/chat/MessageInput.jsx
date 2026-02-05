import React, { useState, useRef } from "react";
import { 
  Send, 
  Paperclip, 
  Smile, 
  ShieldCheck, 
  Command,
  Zap,
  PackageCheck
} from "lucide-react";

const MessageInput = ({ onSendMessage, isDisabled }) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  // Quick Action Buttons Logic
  const addQuickText = (text) => {
    setMessage((prev) => prev + text);
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 md:p-6 bg-white border-t border-slate-100">
      
      {/* --- Quick Action Toolbar --- */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => addQuickText("Batch status: Verified ✓")}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tight hover:bg-blue-100 transition-all"
        >
          <PackageCheck size={12} /> Verify Batch
        </button>
        <button 
          onClick={() => addQuickText("Merkle Proof Validated 🛡️")}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-tight hover:bg-slate-100 transition-all"
        >
          <Zap size={12} /> Share Proof
        </button>
        <button 
          onClick={() => addQuickText("Please provide the Product ID.")}
          className="flex-shrink-0 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-tight hover:bg-slate-100 transition-all"
        >
          Request ID
        </button>
      </div>

      {/* --- Main Input Area --- */}
      <form 
        onSubmit={handleSubmit}
        className={`relative flex items-center gap-2 p-2 rounded-[2rem] border transition-all duration-300
          ${isDisabled ? 'bg-slate-50 border-slate-100 opacity-50' : 'bg-white border-slate-200 shadow-sm focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/5'}
        `}
      >
        {/* Attachment Button */}
        <button 
          type="button"
          disabled={isDisabled}
          className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
        >
          <Paperclip size={20} />
        </button>

        {/* Text Input */}
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isDisabled}
          placeholder={isDisabled ? "Initializing XMTP Client..." : "Type encrypted message..."}
          className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-sm font-bold text-slate-700 placeholder:text-slate-300"
        />

        {/* Emoji/Action Icons */}
        <div className="hidden md:flex items-center gap-1 pr-2">
          <button type="button" className="p-2 text-slate-300 hover:text-amber-500 transition-colors">
            <Smile size={20} />
          </button>
          <button type="button" className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
            <Command size={18} />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || isDisabled}
          className={`p-3 rounded-full shadow-lg transition-all active:scale-90 flex items-center justify-center
            ${!message.trim() || isDisabled 
              ? 'bg-slate-100 text-slate-300 shadow-none' 
              : 'bg-slate-900 text-white hover:bg-blue-600 shadow-blue-200'}
          `}
        >
          <Send size={20} className={message.trim() ? "translate-x-0.5" : ""} />
        </button>
      </form>

      {/* --- Footer Status --- */}
      <div className="mt-3 flex justify-center items-center gap-4">
        <div className="flex items-center gap-1">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">End-to-End Encrypted</span>
        </div>
        <div className="h-1 w-1 bg-slate-200 rounded-full" />
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Powered by XMTP</span>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;