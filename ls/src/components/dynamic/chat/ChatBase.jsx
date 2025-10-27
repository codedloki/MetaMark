import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [selectedChat, setSelectedChat] = useState(null);

  const chats = [
    { id: 1, name: "Alice", lastMessage: "Hey, what's up?" },
    { id: 2, name: "Bob", lastMessage: "Hello!" },
    { id: 3, name: "Charlie", lastMessage: "See you later." },
  ];

  return (
    <div className="flex h-screen bg-darkBg text-white">
      <Sidebar chats={chats} setSelectedChat={setSelectedChat} />
      <ChatWindow selectedChat={selectedChat} />
    </div>
  );
}

export default App;
