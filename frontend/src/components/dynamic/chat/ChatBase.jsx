// import React, { useState } from "react";
// import ChatSidebar from './ChatSidebar.jsx'
// import ChatWindow from "./ChatWindow";

// function App() {
//   const [selectedChat, setSelectedChat] = useState(null);

//   const chats = [
//     { id: 1, name: "Alice", lastMessage: "Hey, what's up?" },
//     { id: 2, name: "Bob", lastMessage: "Hello!" },
//     { id: 3, name: "Charlie", lastMessage: "See you later." },
//   ];

//   return (
//     <div className="flex h-screen bg-darkBg text-white ml-[15%]">
//       <ChatSidebar chats={chats} setSelectedChat={setSelectedChat} />
//       <ChatWindow selectedChat={selectedChat} />
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import ChatSidebar from "./ChatSidebar.jsx";
import ChatWindow from "./ChatWindow.tsx";

function ChatBase() {
  const [selectedChat, setSelectedChat] = useState(null);

  const chats = [
    {
      id: 1,
      name: "Alice",
      address: "0xb72937218804CEe992473D26283682B621FB7244",
      lastMessage: "Hey, what's up?",
    },
    { id: 2, name: "Bob", address: "0x749..18", lastMessage: "Hello!" },
    {
      id: 3,
      name: "Charlie",
      address: "0x583..19",
      lastMessage: "See you later.",
    },
  ];

  return (
    <div className="flex h-screen bg-darkBg text-white ml-[15%] w-screen">
      {/*<ChatSidebar chats={chats} setSelectedChat={setSelectedChat} />*/}
      <ChatWindow selectedChat={selectedChat} />
    </div>
  );
}

export default ChatBase;
