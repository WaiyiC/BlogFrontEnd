import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://a9cae81d-c094-4635-9860-14e886ff26fe-00-1n32cs1xece6w.pike.replit.dev:3000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthCredentials = (username: string, password: string) => {
  api.defaults.auth = {
    username: username,
    password: password
  };
};

export default api;
