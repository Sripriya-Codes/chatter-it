import { format } from 'date-fns';

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`message-row ${isOwn ? 'own' : ''}`}>
      <div className="message-bubble">
        {!isOwn && <span className="message-username">{message.username}</span>}
        <p className="message-text">{message.text}</p>
        <div className="message-meta">
          <span>{format(new Date(message.timestamp), 'HH:mm')}</span>
          {isOwn && <span className="status">{message.status}</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;