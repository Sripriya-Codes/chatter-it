const Message = require('../models/Message');

const onlineUsers = new Map(); // socket.id -> username

const markMessagesReadForUser = async (io, username) => {
  const unread = await Message.find({
    username: { $ne: username },
    'readBy.username': { $ne: username },
  });

  if (unread.length === 0) return;

  const updates = [];

  for (const msg of unread) {
    msg.readBy.push({ username, readAt: new Date() });
    await msg.save();
    updates.push({ messageId: msg._id, readBy: msg.readBy });
  }

  io.emit('message:readBulkUpdate', updates);
};

const initChatSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // user joins with a username
    socket.on('user:join', async (username) => {
      onlineUsers.set(socket.id, username);
      io.emit('users:online', Array.from(new Set(onlineUsers.values())));
      socket.broadcast.emit('user:joined', username);

      try {
        await markMessagesReadForUser(io, username);
      } catch (err) {
        console.error('Failed to mark messages as read:', err.message);
      }
    });

    // new message
    socket.on('message:send', async ({ username, text }) => {
      try {
        if (!username || !text?.trim()) return;

        const message = await Message.create({ username, text, readBy: [] });
        io.emit('message:receive', message);

        // instantly mark as read for anyone else already online
        const onlineUsernames = new Set(onlineUsers.values());
        onlineUsernames.delete(username);

        if (onlineUsernames.size > 0) {
          onlineUsernames.forEach((u) => {
            message.readBy.push({ username: u, readAt: new Date() });
          });
          await message.save();
          io.emit('message:readBulkUpdate', [
            { messageId: message._id, readBy: message.readBy },
          ]);
        }
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