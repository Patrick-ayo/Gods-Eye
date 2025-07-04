// import Logo from "./Logo.jsx";
// import AddButton from "./AddButton.jsx";
// import "./style.css";

// function Sidebar() {
//   return (
//     <div className="sidebar">
//       <Logo />
//       <h1>Sidebar</h1>
//       <AddButton />
//     </div>
//   );
// }

// export default Sidebar;

import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo.jsx";
import AddButton from "./AddButton.jsx";
import zoeIco from "../avatars/zoe.png";
import "./style.css";

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState("1");

  const users = [
    { key: "1", name: "Zoe", icon: zoeIco, status: "online", lastMessage: "Yes I can do it for you" },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="sidebar h-full bg-white border-r border-gray-200 flex flex-col transition-colors">
      {/* Top: Logo */}
      <div className="p-4 border-b border-gray-200">
        <Logo />
      </div>

      {/* Middle: Search + Conversations */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Search */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Conversation List */}
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user.key}
              onClick={() => setSelectedUser(user.key)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUser === user.key
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                <img
                  src={user.icon}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  user.status === "online" ? "bg-green-500" : "bg-gray-400"
                }`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                </div>
                <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: AddButton */}
      <div className="p-4 border-t border-gray-200">
        <AddButton />
      </div>
    </div>
  );
}
