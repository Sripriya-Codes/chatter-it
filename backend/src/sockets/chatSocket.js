const Message = require('../models/Message');

const onlineUsers = new Map(); // socket.id -> username

const initChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // user joins with a username
    socket.on('user:join', (username) => {
      onlineUsers.set(socket.id, username);
      io.emit('users:online', Array.from(new Set(onlineUsers.values())));
      socket.broadcast.emit('user:joined', username);
    });

    // new message
    socket.on('message:send', async ({ username, text }) => {
      try {
        if (!username || !text?.trim()) return;
        const message = await Message.create({ username, text, status: 'delivered' });
        io.emit('message:receive', message); // broadcast to everyone including sender
      } catch (err) {
        socket.emit('error:message', 'Failed to send message');
      }
    });

    // typing indicator
    socket.on('typing:start', (username) => {
      socket.broadcast.emit('typing:update', { username, isTyping: true });
    });

    socket.on('typing:stop', (username) => {
      socket.broadcast.emit('typing:update', { username, isTyping: false });
    });

    // read receipt
    socket.on('message:read', async (messageId) => {
      try {
        await Message.findByIdAndUpdate(messageId, { status: 'read' });
        io.emit('message:statusUpdate', { messageId, status: 'read' });
      } catch (err) {
        console.error('Failed to update read status:', err.message);
      }
    });

    // disconnect
    socket.on('disconnect', () => {
      const username = onlineUsers.get(socket.id);
      onlineUsers.delete(socket.id);
      io.emit('users:online', Array.from(new Set(onlineUsers.values())));
      if (username) io.emit('user:left', username);
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initChatSocket;