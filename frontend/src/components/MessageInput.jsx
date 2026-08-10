import { useState, useRef } from 'react';

const MessageInput = ({ onSend, onTyping }) => {
  const [text, setText] = useState('');
  const typingTimeout = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    onTyping(true);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => onTyping(false), 1200);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    onTyping(false);
  };

  return (
    <form className="message-input" onSubmit={handleSend}>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="Type a message..."
      />
      <button type="submit" disabled={!text.trim()}>Send</button>
    </form>
  );
};

export default MessageInput;