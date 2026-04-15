import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('atm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const authService = {
  login: async (accountNumber, pin) => {
    const response = await api.post('/auth/login', { account_number: accountNumber, pin });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('atm_token');
  },
};

// Account Services
export const accountService = {
  getBalance: async () => {
    const response = await api.get('/account/balance');
    return response.data;
  },
  deposit: async (amount) => {
    const response = await api.post('/account/deposit', { amount: parseFloat(amount) });
    return response.data;
  },
  withdraw: async (amount) => {
    const response = await api.post('/account/withdraw', { amount: parseFloat(amount) });
    return response.data;
  },
  getTransactions: async () => {
    const response = await api.get('/account/transactions');
    return response.data;
  },
};

export default api;
