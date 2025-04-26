import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Sesuaikan dengan URL backend kamu
});

// Kalau user login, tambahkan token ke header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
