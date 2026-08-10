import { useEffect, useState, useCallback } from 'react';
import { useSocket } from './hooks/useSocket';
import { fetchMessages } from './services/api';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import UserList from './components/UserList';
import './index.css';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [username, setUsername] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [error, setError] = useState(null);
  const socketRef = useSocket();

  useEffect(() => {
    if (!username) return;

    fetchMessages().then(setMessages).catch(() => setError('Could not load chat history'));

    const socket = socketRef.current;
    socket.emit('user:join', username);

    socket.on('message:receive', (msg) => setMessages((prev) => [...prev, msg]));
    socket.on('users:online', setOnlineUsers);
    socket.on('typing:update', ({ username: u, isTyping }) => {
      setTypingUsers((prev) => (isTyping ? [...new Set([...prev, u])] : prev.filter((x) => x !== u)));
    });
    socket.on('error:message', (msg) => setError(msg));
    socket.on('connect_error', () => setError('Connection lost. Retrying...'));

    return () => {
      socket.off('message:receive');
      socket.off('users:online');
      socket.off('typing:update');
      socket.off('error:message');
      socket.off('connect_error');
    };
  }, [username, socketRef]);

  const handleSend = useCallback((text) => {
    socketRef.current.emit('message:send', { username, text });
  }, [username, socketRef]);

  const handleTyping = useCallback((isTyping) => {
    socketRef.current.emit(isTyping ? 'typing:start' : 'typing:stop', username);
  }, [username, socketRef]);

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  if (!username) return <LoginScreen onLogin={setUsername} />;

  return (
    <div className="app">
      <header className="app-header">
        <h2>Real-Time Chat</h2>
        <span>Logged in as {username}</span>
      </header>
      <main className="app-main">
        <UserList users={onlineUsers} typingUsers={typingUsers} />
        <section className="chat-section">
          {error && <div className="error-banner">{error}</div>}
          <ChatWindow messages={messages} currentUser={username} />
          <MessageInput onSend={handleSend} onTyping={handleTyping} />
        </section>
      </main>
    </div>
  );
}

export default App;