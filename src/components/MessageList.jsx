import React, { useEffect, useRef } from "react";

const MessageList = ({ messages, currentUser, typingUsers }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.user === currentUser.username;

        return (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <img
              src={message.avatar}
              alt={message.user}
              className="w-8 h-8 rounded-full bg-slate-600"
            />
            <div
              className={`max-w-xs lg:max-w-md ${
                isOwnMessage ? "text-right" : ""
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-slate-300">
                  {message.user}
                </span>
                <span className="text-xs text-slate-500">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div
                className={`inline-block px-4 py-2 rounded-2xl ${
                  isOwnMessage
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    : "bg-slate-700/80 text-slate-100"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Typing Indicators */}
      {typingUsers.length > 0 && (
        <div className="flex items-center space-x-2 px-4 py-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <span className="text-sm text-slate-400">
            {typingUsers.length === 1
              ? `${typingUsers[0]} is typing...`
              : `${typingUsers.join(", ")} are typing...`}
          </span>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
