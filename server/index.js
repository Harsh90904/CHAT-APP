import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store connected users and their socket IDs
const users = new Map();
const rooms = new Map();

// Initialize default room
rooms.set('general', {
  name: 'General',
  messages: [],
  users: new Set()
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('join', (userData) => {
    const user = {
      id: socket.id,
      username: userData.username,
      avatar: userData.avatar,
      status: 'online'
    };
    
    users.set(socket.id, user);
    
    // Join general room by default
    socket.join('general');
    rooms.get('general').users.add(socket.id);
    
    // Broadcast user list update
    io.emit('users_updated', Array.from(users.values()));
    
    // Send room data to the user
    socket.emit('room_joined', {
      room: 'general',
      messages: rooms.get('general').messages
    });
    
    // Notify others about new user
    socket.broadcast.emit('user_joined', user);
  });

  // Handle group messages
  socket.on('send_message', (messageData) => {
    const user = users.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now() + Math.random(),
      user: user.username,
      avatar: user.avatar,
      content: messageData.content,
      timestamp: new Date(),
      room: messageData.room || 'general'
    };

    // Store message in room
    if (rooms.has(message.room)) {
      rooms.get(message.room).messages.push(message);
    }

    // Broadcast to room
    io.to(message.room).emit('message_received', message);
  });

  // Handle private messages
  socket.on('send_private_message', (data) => {
    const sender = users.get(socket.id);
    if (!sender) return;

    const message = {
      id: Date.now() + Math.random(),
      from: sender.username,
      fromAvatar: sender.avatar,
      to: data.to,
      content: data.content,
      timestamp: new Date(),
      private: true
    };

    // Find recipient's socket
    const recipientSocket = Array.from(users.entries())
      .find(([_, user]) => user.username === data.to)?.[0];

    if (recipientSocket) {
      // Send to recipient
      io.to(recipientSocket).emit('private_message_received', message);
      // Send confirmation to sender
      socket.emit('private_message_sent', message);
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const user = users.get(socket.id);
    if (!user) return;

    if (data.private && data.to) {
      // Private typing indicator
      const recipientSocket = Array.from(users.entries())
        .find(([_, user]) => user.username === data.to)?.[0];
      
      if (recipientSocket) {
        io.to(recipientSocket).emit('user_typing', {
          username: user.username,
          private: true
        });
      }
    } else {
      // Group typing indicator
      socket.broadcast.to(data.room || 'general').emit('user_typing', {
        username: user.username,
        room: data.room || 'general'
      });
    }
  });

  socket.on('typing_stop', (data) => {
    const user = users.get(socket.id);
    if (!user) return;

    if (data.private && data.to) {
      // Private typing stop
      const recipientSocket = Array.from(users.entries())
        .find(([_, user]) => user.username === data.to)?.[0];
      
      if (recipientSocket) {
        io.to(recipientSocket).emit('user_stopped_typing', {
          username: user.username,
          private: true
        });
      }
    } else {
      // Group typing stop
      socket.broadcast.to(data.room || 'general').emit('user_stopped_typing', {
        username: user.username,
        room: data.room || 'general'
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      // Remove from rooms
      rooms.forEach((room) => {
        room.users.delete(socket.id);
      });
      
      users.delete(socket.id);
      
      // Broadcast user list update
      io.emit('users_updated', Array.from(users.values()));
      io.emit('user_left', user);
    }
    
    console.log('User disconnected:', socket.id);
  });
});

// const PORT =  9020;
server.listen(3001, () => {
  console.log('Server running on port 3001');
});