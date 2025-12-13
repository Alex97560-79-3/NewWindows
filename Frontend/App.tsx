// frontend/App.tsx
import React, { useEffect, useState } from 'react';

import {
  login as apiLogin,
  register as apiRegister,
  setAuthToken,
  getUsers,
  getProducts,
  getOrders,
  getReviews,
  createOrder,
  updateOrder,
  createProduct,
  updateProduct,
  deleteProduct,
  createUser,
  updateUser,
  deleteUser,
  deleteReview,
  updateReview
} from './services/Api.ts';

import { Layout } from './components/Layout';
import { ProductCard } from './components/ProductCard';
import { UserProfile } from './components/UserProfile';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AdminDashboard } from './components/AdminDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';
import { AssemblerDashboard } from './components/AssemblerDashboard';
import { ProductDetails } from './components/ProductDetails';

import { User, Product, Order, Review } from './types';
import { CATEGORIES } from './constants';

const App: React.FC = () => {
  /* ----------------------------------------
     AUTH State
  ---------------------------------------- */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  /* ----------------------------------------
     DATA State
  ---------------------------------------- */
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cartComment, setCartComment] = useState('');

  /* ----------------------------------------
     VIEW State
  ---------------------------------------- */
  const [currentView, setCurrentView] = useState('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  /* ----------------------------------------
     FILTER State
  ---------------------------------------- */
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [isSaleOnly, setIsSaleOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  /* ----------------------------------------
     LOAD INITIAL DATA
  ---------------------------------------- */
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
      // Опционально: backend можно расширить endpoint /auth/me
      // чтобы автоматически получать текущего пользователя
    }

    // Загружаем данные после старта
    const fetchData = async () => {
      try {
        const [prodRes, userRes, orderRes, reviewRes] = await Promise.all([
          getProducts(),
          getUsers().catch(() => ({ data: [] })), // у обычных юзеров может быть 403
          getOrders().catch(() => ({ data: [] })), // то же самое
          getReviews()
        ]);

        // backend возвращает { data: [...] }
        setProducts(prodRes.data || []);
        setUsers(userRes.data || []);
        setOrders(orderRes.data || []);
        setReviews(reviewRes.data || []);

      } catch (err) {
        console.error('Load error:', err);
      }
    };

    fetchData();
  }, []);

  /* ----------------------------------------
     AUTH
  ---------------------------------------- */
  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await apiLogin(email, password);

      // backend возвращает { data: { token, user } }
      const payload = res.data;

      const token = payload.token;
      const user = payload.user;

      localStorage.setItem('token', token);
      setAuthToken(token);
      setIsLoggedIn(true);
      setCurrentUser(user);

      if (user.role === 'admin') setCurrentView('admin-products');
      else if (user.role === 'manager') setCurrentView('manager-dashboard');
      else if (user.role === 'assembler') setCurrentView('assembler-dashboard');
      else setCurrentView('catalog');

    } catch (err) {
      alert('Ошибка входа');
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const res = await apiRegister(name, email, password);

      const payload = res.data;

      const token = payload.token;
      const user = payload.user;

      localStorage.setItem('token', token);
      setAuthToken(token);
      setIsLoggedIn(true);
      setCurrentUser(user);
      setCurrentView('catalog');

    } catch (err) {
      alert('Ошибка регистрации');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView('catalog');
  };

  /* ----------------------------------------
     PRODUCTS CRUD
  ---------------------------------------- */
  const handleAddProduct = async (product: Product) => {
    const res = await createProduct(product);
    setProducts(prev => [...prev, res.data]);
  };

  const handleUpdateProduct = async (product: Product) => {
    const res = await updateProduct(product.id!, product);
    setProducts(prev => prev.map(p => p.id === product.id ? res.data : p));
  };

  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  /* ----------------------------------------
     USERS CRUD
  ---------------------------------------- */
  const handleAddUser = async (user: User) => {
    const res = await createUser(user);
    setUsers(prev => [...prev, res.data]);
  };

  const handleUpdateUser = async (user: User) => {
    const res = await updateUser(user.id!, user);
    setUsers(prev => prev.map(u => u.id === user.id ? res.data : u));
  };

  const handleDeleteUser = async (id: number) => {
    await deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  /* ----------------------------------------
     ORDERS
  ---------------------------------------- */
  const handleCreateOrder = async () => {
    if (!currentUser) return alert('Войдите в аккаунт');

    const newOrder = {
      customerName: currentUser.name,
      customerPhone: (currentUser as any).phone || '+79990000000',
      items: cart.map(item => ({
        productId: item.id!,
        quantity: (item as any).quantity || 1,
        basePrice: item.base_price,
        name: item.name,
        imageUrl: item.image_url
      })),
      comments: cartComment
        ? [{ author: currentUser.name, text: cartComment, isInternal: false }]
        : []
    };

    const res = await createOrder(newOrder);
    setOrders(prev => [res.data, ...prev]);
    setCart([]);
    setCartComment('');
    setCurrentView('orders');
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const res = await updateOrder(orderId, { status });
    setOrders(prev => prev.map(o => (o.id === orderId ? res.data : o)));
  };

  /* ----------------------------------------
     REVIEWS
  ---------------------------------------- */
  const handleDeleteReview = async (id: number) => {
    await deleteReview(id);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const handleReplyReview = async (id: number, text: string) => {
    const review = reviews.find(r => r.id === id);
    if (!review) return;

    const res = await updateReview(id, { reply: text });
    setReviews(prev => prev.map(r => r.id === id ? res.data : r));
  };

  /* ----------------------------------------
     CART / FAVORITES
  ---------------------------------------- */
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const exist = prev.find(p => p.id === product.id);
      if (exist) {
        return prev.map(p =>
          p.id === product.id ? { ...p, quantity: (p as any).quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 } as any];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const handleToggleFavorite = (id: number) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  /* ----------------------------------------
     RENDER (UI остается как в вашем коде)
  ---------------------------------------- */
  return (
    <Layout
      currentRole={currentUser?.role || 'guest'}
      cartCount={cart.reduce((acc, item) => acc + ((item as any).quantity || 0), 0)}
      favoritesCount={favorites.length}
      onNavigate={setCurrentView}
      currentView={currentView}
      onLogout={handleLogout}
      isLoggedIn={isLoggedIn}
      userName={currentUser?.name}
      avatarUrl={currentUser?.avatar_url}
      onCategorySelect={setSelectedCategoryId}
      onToggleSale={() => setIsSaleOnly(!isSaleOnly)}
    >
      {currentView === 'login' && (
        <Login 
          onLogin={(name, role, token) => {
            setIsLoggedIn(true);
            setCurrentUser({ name, role } as User);
            localStorage.setItem('token', token);
            setAuthToken(token);
            
            if (role === 'admin') setCurrentView('admin-products');
            else if (role === 'manager') setCurrentView('manager-dashboard');
            else if (role === 'assembler') setCurrentView('assembler-dashboard');
            else setCurrentView('catalog');
          }}
          onNavigateToRegister={() => setCurrentView('register')}
        />
      )}

      {currentView === 'register' && (
        <Register 
          onRegister={(name, role, token) => {
            setIsLoggedIn(true);
            setCurrentUser({ name, role } as User);
            localStorage.setItem('token', token);
            setAuthToken(token);
            setCurrentView('catalog');
          }}
          onNavigateToLogin={() => setCurrentView('login')}
        />
      )}

      {currentView === 'catalog' && (
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Добро пожаловать в НовыеОкна
          </h1>
          <p className="text-slate-600">
            {isLoggedIn ? `Привет, ${currentUser?.name}!` : 'Войдите чтобы начать покупки'}
          </p>
        </div>
      )}

      {/* 
        TODO: Вставьте сюда остальные view
        renderCart(), renderFavorites(), renderOrders(), renderProfile(), 
        renderAdminPanel(), renderManagerDashboard(), renderAssemblerDashboard() и т.д.
      */}
    </Layout>
  );
};

export default App;