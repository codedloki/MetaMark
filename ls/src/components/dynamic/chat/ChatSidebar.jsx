import React from "react";
import { Avatar, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function Sidebar({ chats, setSelectedChat }) {
  return (
    <div className="w-1/4 bg-darkSidebar flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Avatar sx={{ bgcolor: "#25D366" }}>U</Avatar>
        <div className="flex space-x-2">
          <IconButton sx={{ color: "white" }}>
            <SearchIcon />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      {/* Search */}
      <div className="p-2">
        <div className="flex items-center bg-darkAccent rounded-full p-2">
          <SearchIcon className="text-gray-400" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-darkAccent flex-1 ml-2 outline-none text-white"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center p-4 hover:bg-darkAccent cursor-pointer"
            onClick={() => setSelectedChat(chat)}
          >
            <Avatar sx={{ bgcolor: "#075E54" }}>{chat.name[0]}</Avatar>
            <div className="ml-4">
              <p className="font-semibold">{chat.name}</p>
              <p className="text-gray-400 text-sm">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
