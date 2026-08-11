import { format, isToday, isYesterday } from 'date-fns';

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return format(date, 'h:mm a');
  }

  if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mm a')}`;
  }

  const now = new Date();
  const isThisYear = date.getFullYear() === now.getFullYear();

  if (isThisYear) {
    return `${format(date, 'MMM d')}, ${format(date, 'h:mm a')}`;
  }

  return `${format(date, 'MMM d, yyyy')}, ${format(date, 'h:mm a')}`;
};

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`message-row ${isOwn ? 'own' : ''}`}>
      <div className="message-bubble">
        {!isOwn && <span className="message-username">{message.username}</span>}
        <p className="message-text">{message.text}</p>
        <div className="message-meta">
          <span className="message-time">{formatMessageTime(message.timestamp)}</span>
          {isOwn && <span className="message-status">{message.status}</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;