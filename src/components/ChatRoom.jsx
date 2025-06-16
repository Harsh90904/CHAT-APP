import React, { useState } from "react";
import { Users, MessageCircle, Send, Wifi, WifiOff } from "lucide-react";
import MessageList from "./MessageList";
import UserList from "./UserList";
import MessageInput from "./MessageInput";
import PrivateChat from "./PrivateChat";

const ChatRoom = ({
  currentUser,
  users,
  messages,
  privateMessages,
  typingUsers,
  onSendMessage,
  onSendPrivateMessage,
  onTypingStart,
  onTypingStop,
  isConnected,
}) => {
  const [activeTab, setActiveTab] = useState("group");
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (username) => {
    if (username !== currentUser.username) {
      setSelectedUser(username);
      setActiveTab("private");
    }
  };

  const getPrivateMessagesWithUser = (username) => {
    return privateMessages.filter(
      (msg) =>
        (msg.from === currentUser.username && msg.to === username) ||
        (msg.from === username && msg.to === currentUser.username)
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar */}
      <div className="w-80 bg-slate-800/80 backdrop-blur-lg border-r border-slate-700/50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">ChatFlow</h1>
              <div className="flex items-center space-x-2 text-sm">
                {isConnected ? (
                  <>
                    <Wifi size={12} className="text-emerald-400" />
                    <span className="text-emerald-400">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={12} className="text-red-400" />
                    <span className="text-red-400">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-700/50">
          <button
            onClick={() => setActiveTab("group")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "group"
                ? "text-blue-400 border-b-2 border-blue-400 bg-slate-700/30"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageCircle size={16} />
              <span>General</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("private")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "private"
                ? "text-purple-400 border-b-2 border-purple-400 bg-slate-700/30"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users size={16} />
              <span>Direct</span>
            </div>
          </button>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          <UserList
            users={users}
            currentUser={currentUser}
            onUserClick={handleUserClick}
            selectedUser={selectedUser}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeTab === "group" ? (
          <>
            {/* Group Chat Header */}
            <div className="p-4 bg-slate-800/60 backdrop-blur-lg border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    General Chat
                  </h2>
                  <p className="text-sm text-slate-400">
                    {users.length} members online
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              <MessageList
                messages={messages}
                currentUser={currentUser}
                typingUsers={typingUsers}
              />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-slate-800/60 backdrop-blur-lg border-t border-slate-700/50">
              <MessageInput
                onSendMessage={onSendMessage}
                onTypingStart={() => onTypingStart()}
                onTypingStop={() => onTypingStop()}
                placeholder="Type a message..."
                disabled={!isConnected}
              />
            </div>
          </>
        ) : (
          <PrivateChat
            currentUser={currentUser}
            selectedUser={selectedUser}
            users={users}
            messages={
              selectedUser ? getPrivateMessagesWithUser(selectedUser) : []
            }
            onSendMessage={onSendPrivateMessage}
            onTypingStart={onTypingStart}
            onTypingStop={onTypingStop}
            onUserSelect={setSelectedUser}
            isConnected={isConnected}
          />
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
