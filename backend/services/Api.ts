// src/services/api.ts
import axios from 'axios';
import { User, Product, Order, Review } from '../src/Types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------- Auth ----------------
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const login = async (email: string, password: string) => {
  const res = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
  return res.data;
};

export const register = async (name: string, email: string, password: string) => {
  const res = await api.post<{ token: string; user: User }>('/auth/register', { name, email, password });
  return res.data;
};

// ---------------- Users ----------------
export const getUsers = async () => (await api.get<User[]>('/users')).data;
export const createUser = async (user: Partial<User>) => (await api.post<User>('/users', user)).data;
export const updateUser = async (id: number, user: Partial<User>) => (await api.put<User>(`/users/${id}`, user)).data;
export const deleteUser = async (id: number) => (await api.delete(`/users/${id}`)).data;

// ---------------- Products ----------------
export const getProducts = async () => (await api.get<Product[]>('/products')).data;
export const createProduct = async (product: Partial<Product>) => (await api.post<Product>('/products', product)).data;
export const updateProduct = async (id: number, product: Partial<Product>) => (await api.put<Product>(`/products/${id}`, product)).data;
export const deleteProduct = async (id: number) => (await api.delete(`/products/${id}`)).data;

// ---------------- Orders ----------------
export const getOrders = async () => (await api.get<Order[]>('/orders')).data;
export const createOrder = async (order: Partial<Order>) => (await api.post<Order>('/orders', order)).data;
export const updateOrder = async (id: number, order: Partial<Order>) => (await api.put<Order>(`/orders/${id}`, order)).data;
export const deleteOrder = async (id: number) => (await api.delete(`/orders/${id}`)).data;

// ---------------- Reviews ----------------
export const getReviews = async () => (await api.get<Review[]>('/reviews')).data;
export const createReview = async (review: Partial<Review>) => (await api.post<Review>('/reviews', review)).data;
export const updateReview = async (id: number, review: Partial<Review>) => (await api.put<Review>(`/reviews/${id}`, review)).data;
export const deleteReview = async (id: number) => (await api.delete(`/reviews/${id}`)).data;
