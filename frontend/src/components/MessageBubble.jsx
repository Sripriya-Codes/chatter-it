import { useState } from 'react';
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
  const [showReaders, setShowReaders] = useState(false);

  const readers = (message.readBy || []).filter((r) => r.username !== message.username);
  const status = readers.length > 0 ? 'Read' : 'Delivered';

  return (
    <div className={`message-row ${isOwn ? 'own' : ''}`}>
      <div className="message-bubble">
        {!isOwn && <span className="message-username">{message.username}</span>}
        <p className="message-text">{message.text}</p>
        <div className="message-meta">
          <span className="message-time">{formatMessageTime(message.timestamp)}</span>
          {isOwn && (
            <span className="message-status-row">
              <span className="message-status">{status}</span>
              <button
                type="button"
                className="read-info-btn"
                onClick={() => setShowReaders((prev) => !prev)}
                aria-label="Show read receipts"
              >
                i
              </button>
            </span>
          )}
        </div>
        {isOwn && showReaders && (
          <div className="read-receipts-popover">
            {readers.length === 0 ? (
              <p>Not read yet</p>
            ) : (
              <ul>
                {readers.map((r) => (
                  <li key={r.username}>
                    <span>{r.username}</span>
                    <span>{format(new Date(r.readAt), 'MMM d, h:mm a')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;