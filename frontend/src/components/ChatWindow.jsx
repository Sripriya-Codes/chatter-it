import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ messages, currentUser, typingUsers = [] }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  return (
    <div className="chat-window">
      {messages.map((msg) => (
        <MessageBubble key={msg._id || msg.timestamp} message={msg} isOwn={msg.username === currentUser} />
      ))}
      {typingUsers.filter((u) => u !== currentUser).length > 0 && (
        <div className="chat-typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;