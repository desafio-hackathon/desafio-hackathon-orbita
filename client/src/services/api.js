import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const enviarScoreDiario = (userId, score) => api.post('/daily-score', { userId, score });

export default api;
