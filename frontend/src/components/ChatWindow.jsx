import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

const ChatWindow = ({ messages, currentUser }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-window">
      {messages.map((msg) => (
        <MessageBubble key={msg._id || msg.timestamp} message={msg} isOwn={msg.username === currentUser} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;