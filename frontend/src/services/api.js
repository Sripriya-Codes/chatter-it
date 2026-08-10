import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchMessages = async () => {
  const res = await axios.get(`${API_URL}/api/messages`);
  return res.data.data;
};