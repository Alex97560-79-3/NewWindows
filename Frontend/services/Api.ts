// frontend/services/Api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE = 'http://localhost:4000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
});

// Перехватчик запросов - добавляем токен из localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Failed to read token from localStorage:', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов - обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Если токен невалидный или истек - очищаем его
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } catch (e) {
        console.warn('Failed to clear token:', e);
      }
    }
    
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try { 
      localStorage.setItem('token', token); 
    } catch (e) { 
      console.warn('Failed to save token:', e);
    }
  } else {
    delete api.defaults.headers.common['Authorization'];
    try { 
      localStorage.removeItem('token'); 
    } catch (e) { 
      console.warn('Failed to remove token:', e);
    }
  }
};

/* -------------------------
   AUTH
   ------------------------- */
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  return await response.json();
};

export const register = async (name: string, email: string, password: string) => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }

  return await response.json();
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
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

export const updateProfile = async (payload: any) => {
  const res = await api.put('/users/profile', payload, { withCredentials: true });
  return res.data.data;
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
export const getReviews = async (productId?: number) => {
  const params = productId ? { productId } : {};
  const res = await api.get('/reviews', { params });
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

// Добавьте новую функцию для заказов текущего пользователя
export const getMyOrders = async () => {
  const res = await api.get('/orders/my');
  return res.data;
};

export default api;
