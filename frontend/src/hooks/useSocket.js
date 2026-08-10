import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(API_URL, { transports: ['websocket'] });
    return () => socketRef.current.disconnect();
  }, []);

  return socketRef;
};