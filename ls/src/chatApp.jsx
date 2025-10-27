import React, { useState } from "react";

const manufacturers = [
  { name: "Manufacturer A", publicAddress: "0x123...A" },
  { name: "Manufacturer B", publicAddress: "0x456...B" },
  { name: "Manufacturer C", publicAddress: "0x789...C" },
];

const ChatApp = () => {
  const [selectedManufacturer, setSelectedManufacturer] = useState(manufacturers[0]);
  const [messages, setMessages] = useState([
    { sender: "customer", text: "Hello, I want to verify my product." },
    { sender: "manufacturer", text: "Sure, please send the barcode." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { sender: "customer", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar - Manufacturer List */}
      <div className="w-1/4 bg-gray-700 mt-[15vh] text-white border-r border-gray-600 shadow-lg">
        <div className="p-4 text-xl font-bold border-b border-gray-600">Manufacturers</div>
        <ul>
          {manufacturers.map((m, index) => (
            <li
              key={index}
              onClick={() => setSelectedManufacturer(m)}
              className={`p-4 cursor-pointer hover:bg-gray-600 transition ${
                selectedManufacturer.name === m.name ? "bg-gray-600" : ""
              }`}
            >
              🏭 {m.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Window */}
      <div className="w-3/4 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 mt-[15vh] text-white shadow-md py-4 px-6 border-b border-gray-700">
          <div className="text-lg font-semibold">{selectedManufacturer.name}</div>
          <div className="text-sm text-gray-400">Address: {selectedManufacturer.publicAddress}</div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-md px-4 py-2 rounded-lg shadow text-white ${
                msg.sender === "customer" ? "bg-blue-500 self-end ml-auto" : "bg-green-500 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-gray-700 bg-gray-800 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-black text-white border border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
