// frontend/services/Api.ts
import axios, { AxiosInstance } from 'axios';

const API_BASE = process.env.VITE_API_URL || 'http://localhost:4000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  // timeout: 10000, // можно раскомментировать при необходимости
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try { localStorage.setItem('token', token); } catch (e) { /* ignore */ }
  } else {
    delete api.defaults.headers.common['Authorization'];
    try { localStorage.removeItem('token'); } catch (e) { /* ignore */ }
  }
};

/* -------------------------
   AUTH
   ------------------------- */
export const login = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const register = async (name: string, email: string, password: string) => {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data;
};

export const getMe = async () => {
  const res = await api.get('/auth/me').catch((e) => { throw e.response?.data || e; });
  return res.data;
};

/* -------------------------
   USERS (admin)
   ------------------------- */
export const getUsers = async () => {
  const res = await api.get('/users');
  return res.data;
};
export const createUser = async (payload: any) => {
  const res = await api.post('/users', payload);
  return res.data;
};
export const updateUser = async (id: number, payload: any) => {
  const res = await api.put(`/users/${id}`, payload);
  return res.data;
};
export const deleteUser = async (id: number) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

/* -------------------------
   PRODUCTS
   ------------------------- */
export const getProducts = async (params?: any) => {
  const res = await api.get('/products', { params });
  return res.data;
};
export const getProduct = async (id: number) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
export const createProduct = async (payload: any) => {
  const res = await api.post('/products', payload);
  return res.data;
};
export const updateProduct = async (id: number, payload: any) => {
  const res = await api.put(`/products/${id}`, payload);
  return res.data;
};
export const deleteProduct = async (id: number) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

/* -------------------------
   ORDERS
   ------------------------- */
export const getOrders = async (params?: any) => {
  const res = await api.get('/orders', { params });
  return res.data;
};
export const getOrder = async (id: number) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};
export const createOrder = async (payload: any) => {
  const res = await api.post('/orders', payload);
  return res.data;
};
export const updateOrder = async (id: number, payload: any) => {
  const res = await api.put(`/orders/${id}`, payload);
  return res.data;
};

/* -------------------------
   REVIEWS
   ------------------------- */
export const getReviews = async () => {
  const res = await api.get('/reviews');
  return res.data;
};
export const createReview = async (payload: any) => {
  const res = await api.post('/reviews', payload);
  return res.data;
};
export const updateReview = async (id: number, payload: any) => {
  const res = await api.put(`/reviews/${id}`, payload);
  return res.data;
};
export const deleteReview = async (id: number) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};

export default api;
