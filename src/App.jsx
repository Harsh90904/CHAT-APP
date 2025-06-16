import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import LoginForm from "./components/LoginForm";
import ChatRoom from "./components/ChatRoom";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("users_updated", (userList) => {
      setUsers(userList);
    });

    socket.on("room_joined", (data) => {
      setMessages(data.messages);
    });

    socket.on("message_received", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("private_message_received", (message) => {
      setPrivateMessages((prev) => [...prev, message]);
    });

    socket.on("private_message_sent", (message) => {
      setPrivateMessages((prev) => [...prev, message]);
    });

    socket.on("user_typing", (data) => {
      setTypingUsers((prev) => [
        ...prev.filter((u) => u !== data.username),
        data.username,
      ]);
    });

    socket.on("user_stopped_typing", (data) => {
      setTypingUsers((prev) => prev.filter((u) => u !== data.username));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleJoin = (username) => {
    const userData = {
      username,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };

    if (socketRef.current) {
      socketRef.current.emit("join", userData);
      setCurrentUser({
        id: socketRef.current.id,
        username,
        avatar: userData.avatar,
        status: "online",
      });
    }
  };

  const handleSendMessage = (content, mediaFile = null) => {
    if (!socketRef.current) return;
    if (mediaFile) {
      const formData = new FormData();
      formData.append("file", mediaFile.file);
      formData.append("caption", content);
      formData.append("room", "general");

      fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            socketRef.current.emit("send_message", {
              content: content || "",
              room: "general",
              media: {
                type: mediaFile.type,
                url: data.fileUrl,
                filename: mediaFile.file.name,
                size: mediaFile.file.size,
              },
            });
          }
        })
        .catch((error) => {
          console.error("Upload failed:", error);
        });
    } else {
      socketRef.current.emit("send_message", { content, room: "general" });
    }
  };

  const handleSendPrivateMessage = (to, content, mediaFile = null) => {
    if (!socketRef.current) return;
    if (mediaFile) {
      const formData = new FormData();
      formData.append("file", mediaFile.file);
      formData.append("caption", content);
      formData.append("to", to);

      fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            socketRef.current.emit("send_private_message", {
              to,
              content: content || "",
              media: {
                type: mediaFile.type,
                url: data.fileUrl,
                filename: mediaFile.file.name,
                size: mediaFile.file.size,
              },
            });
          }
        })
        .catch((error) => {
          console.error("Upload failed:", error);
        });
    } else {
      socketRef.current.emit("send_private_message", { to, content });
    }
  };

  const handleTypingStart = (isPrivate = false, recipient) => {
    if (!socketRef.current) return;
    if (isPrivate && recipient) {
      socketRef.current.emit("typing_start", { private: true, to: recipient });
    } else {
      socketRef.current.emit("typing_start", { room: "general" });
    }
  };

  const handleTypingStop = (isPrivate = false, recipient) => {
    if (!socketRef.current) return;
    if (isPrivate && recipient) {
      socketRef.current.emit("typing_stop", { private: true, to: recipient });
    } else {
      socketRef.current.emit("typing_stop", { room: "general" });
    }
  };

  if (!currentUser) {
    return <LoginForm onJoin={handleJoin} isConnected={isConnected} />;
  }

  return (
    <ChatRoom
      currentUser={currentUser}
      users={users}
      messages={messages}
      privateMessages={privateMessages}
      typingUsers={typingUsers}
      onSendMessage={handleSendMessage}
      onSendPrivateMessage={handleSendPrivateMessage}
      onTypingStart={handleTypingStart}
      onTypingStop={handleTypingStop}
      isConnected={isConnected}
    />
  );
}

export default App;
