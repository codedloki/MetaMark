import React, { useEffect, useState, useRef } from "react";
import { Client } from "@xmtp/browser-sdk";
import { Wallet, ethers } from "ethers";

// Manufacturer list with addresses
const manufacturers = [
  { name: "Manufacturer A", publicAddress: "0xe8815c53C9fFaD591AEf727a180A3d1D218e8869" },
  { name: "Manufacturer B", publicAddress: "0x456...B" },
  { name: "Manufacturer C", publicAddress: "0x789...C" },
];

const ChatApp = () => {
  const [selectedManufacturer, setSelectedManufacturer] = useState(manufacturers[0]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [client, setClient] = useState(null);
  const [conversation, setConversation] = useState(null);
  const messageStreamRef = useRef(null);

  // ⚠️ Never expose a real private key in production!
  const TEST_PRIVATE_KEY = "0xbe7c772ad3b91999611d4dc074f7bf42532b7837309d3453bf4cbc98c4cfc1e6";

  // 1. Initialize XMTP client
  useEffect(() => {
    const initXMTP = async () => {
      try {
        const wallet = new Wallet(TEST_PRIVATE_KEY);
        const signer = {
          type: "EOA",
          getIdentifier: async () => ({
            identifier: await wallet.getAddress(),
            identifierKind: "Ethereum",
          }),
          signMessage: async (message) => {
            const signature = await wallet.signMessage(message);
            return ethers.utils.arrayify(signature);
          },
        };

        const xmtpClient = await Client.create(signer);
        setClient(xmtpClient);
      } catch (error) {
        console.error("XMTP Init Error:", error);
      }
    };

    initXMTP();
  }, []);

  // 2. Load conversation and messages
  useEffect(() => {
    const startConversation = async () => {
      if (!client || !selectedManufacturer) return;

      try {
        const conv = await client.conversations.newConversation(
          selectedManufacturer.publicAddress
        );
        setConversation(conv);

        const pastMessages = await conv.messages();
        const formatted = pastMessages.map((msg) => ({
          id: msg.id,
          sender: msg.senderAddress === client.address ? "customer" : "manufacturer",
          text: msg.content,
        }));
        setMessages(formatted);

        // Close existing stream
        if (messageStreamRef.current) {
          try {
            await messageStreamRef.current.return?.();
          } catch (e) {
            console.warn("Stream cleanup error", e);
          }
        }

        // Stream new messages
        const stream = await conv.streamMessages();
        messageStreamRef.current = stream;

        (async () => {
          for await (const msg of stream) {
            setMessages((prev) => [
              ...prev,
              {
                id: msg.id,
                sender: msg.senderAddress === client.address ? "customer" : "manufacturer",
                text: msg.content,
              },
            ]);
          }
        })();
      } catch (error) {
        console.error("Conversation error:", error);
      }
    };

    startConversation();
  }, [client, selectedManufacturer]);

  // 3. Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversation) return;
    try {
      await conversation.send(newMessage);
      setMessages((prev) => [...prev, { sender: "customer", text: newMessage }]);
      setNewMessage("");
    } catch (error) {
      console.error("Send error:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
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

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 mt-[15vh] text-white shadow-md py-4 px-6 border-b border-gray-700">
          <div className="text-lg font-semibold">{selectedManufacturer.name}</div>
          <div className="text-sm text-gray-400">
            Address: {selectedManufacturer.publicAddress}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={`${msg.id || index}-${msg.text}`}
              className={`max-w-md px-4 py-2 rounded-lg shadow text-white transform transition duration-300 ease-in-out animate-fadeIn ${
                msg.sender === "customer"
                  ? "bg-blue-500 self-end ml-auto animate-slideInRight"
                  : "bg-green-500 self-start animate-slideInLeft"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
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
