const Message = require('../models/Message');

// GET /api/messages - fetch chat history
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).limit(200);
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch messages' });
  }
};

// POST /api/messages - send a message (REST fallback, socket is primary path)
const createMessage = async (req, res) => {
  try {
    const { username, text } = req.body;
    if (!username || !text) {
      return res.status(400).json({ success: false, error: 'Username and text are required' });
    }
    const message = await Message.create({ username, text });
    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save message' });
  }
};

module.exports = { getMessages, createMessage };