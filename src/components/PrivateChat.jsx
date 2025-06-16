import React from "react";
import { ArrowLeft, User as UserIcon } from "lucide-react";
import MessageInput from "./MessageInput";

const PrivateChat = ({
  currentUser,
  selectedUser,
  users,
  messages,
  onSendMessage,
  onTypingStart,
  onTypingStop,
  onUserSelect,
  isConnected,
}) => {
  const selectedUserData = users.find((u) => u.username === selectedUser);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">
            Select a user to start chatting
          </h3>
          <p className="text-slate-400">
            Choose someone from the user list to begin a private conversation
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-800/60 backdrop-blur-lg border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onUserSelect(null)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={16} className="text-slate-400" />
          </button>
          {selectedUserData && (
            <>
              <img
                src={selectedUserData.avatar}
                alt={selectedUserData.username}
                className="w-8 h-8 rounded-full bg-slate-600"
              />
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {selectedUserData.username}
                </h2>
                <p className="text-sm text-emerald-400">Online</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.from === currentUser.username;
          const avatar = isOwnMessage
            ? currentUser.avatar
            : selectedUserData?.avatar;

          return (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <img
                src={avatar}
                alt={isOwnMessage ? currentUser.username : selectedUser}
                className="w-8 h-8 rounded-full bg-slate-600"
              />
              <div
                className={`max-w-xs lg:max-w-md ${
                  isOwnMessage ? "text-right" : ""
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-slate-300">
                    {isOwnMessage ? "You" : message.from}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div
                  className={`inline-block px-4 py-2 rounded-2xl ${
                    isOwnMessage
                      ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                      : "bg-slate-700/80 text-slate-100"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-slate-800/60 backdrop-blur-lg border-t border-slate-700/50">
        <MessageInput
          onSendMessage={(content) => onSendMessage(selectedUser, content)}
          onTypingStart={() => onTypingStart(true, selectedUser)}
          onTypingStop={() => onTypingStop(true, selectedUser)}
          placeholder={`Message ${selectedUser}...`}
          disabled={!isConnected}
        />
      </div>
    </div>
  );
};

export default PrivateChat;
