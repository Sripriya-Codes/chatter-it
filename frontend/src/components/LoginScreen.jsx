import { useState } from 'react';
import logo from '../assets/logo.png';

const LoginScreen = ({ onLogin }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="login-screen">
      <form onSubmit={handleSubmit} className="login-card">

        <h1>Welcome</h1>

        <img
          src={logo}
          alt="Chatter-It"
          className="login-logo"
        />

        <p>Enter a username to join the chat</p>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. isha_dev"
          autoFocus
        />

        <button
          type="submit"
          disabled={!username.trim()}
        >
          Join Chat
        </button>

      </form>
    </div>
  );
};

export default LoginScreen;