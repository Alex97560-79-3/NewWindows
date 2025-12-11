
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { AdminDashboard } from './components/AdminDashboard';
import { AssemblerDashboard } from './components/AssemblerDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';
import { UserProfile } from './components/UserProfile';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { UserRole, Product, CartItem, Order, Category, User, OrderComment, Review } from './types';
import { PRODUCTS, CATEGORIES, MOCK_ORDERS, MOCK_USERS, REVIEWS, STATUS_TRANSLATIONS } from './constants';

const App: React.FC = () => {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Data State
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [cartComment, setCartComment] = useState('');

  // View State
  const [currentView, setCurrentView] = useState('catalog'); 
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  
  // Filters State
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all' | 'windows'>('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [deliveryTime, setDeliveryTime] = useState<string>('any');
  const [isSaleOnly, setIsSaleOnly] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [expandedTag, setExpandedTag] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Record<string, string>>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const TAG_OPTIONS = [
      { name: 'Профиль', options: ['Rehau', 'Veka', 'KBE', 'Brusbox', 'Montblanc'] },
      { name: 'Створки', options: ['Одностворчатое', 'Двухстворчатое', 'Трехстворчатое'] },
      { name: 'Стеклопакет', options: ['Однокамерный', 'Двухкамерный', 'Энергосберегающий', 'Мультифункциональный'] },
      { name: 'Другие свойства', options: ['С ламинацией', 'Детский замок', 'Микропроветривание'] },
  ];

  // Dynamic Rating Calculation
  useEffect(() => {
    const updatedProducts = products.map(p => {
        const productReviews = reviews.filter(r => r.productId === p.id);
        const count = productReviews.length;
        if (count === 0) return { ...p, reviewCount: 0, rating: 0 };
        
        const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
        return { ...p, reviewCount: count, rating: Number((totalRating / count).toFixed(1)) };
    });
    if (JSON.stringify(updatedProducts.map(p => p.rating)) !== JSON.stringify(products.map(p => p.rating))) {
         setProducts(updatedProducts);
    }
  }, [reviews]);
  
  // --- Handlers ---

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: number) => {
      setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleToggleFavorite = (productId: number) => {
      setFavorites(prev => 
          prev.includes(productId) 
            ? prev.filter(id => id !== productId) 
            : [...prev, productId]
      );
  };

  const handleViewDetails = (product: Product) => {
      setSelectedProduct(product);
      setCurrentView('product-details');
      window.scrollTo(0, 0);
  };

  const handleLogin = (name: string, role: UserRole) => {
      setIsLoggedIn(true);
      // Find User object
      const userObj = users.find(u => u.name === name && u.role === role);
      if (userObj) {
          setCurrentUser(userObj);
      } else {
          // Fallback
          setCurrentUser({ name, role, email: 'test@example.com' });
      }
      
      // Route based on role
      if (role === UserRole.ADMIN) {
          setCurrentView('admin-products');
      } else if (role === UserRole.ASSEMBLER) {
          setCurrentView('assembler-dashboard');
      } else if (role === UserRole.MANAGER) {
          setCurrentView('manager-dashboard');
      } else {
          setCurrentView('catalog');
      }
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setCurrentView('catalog');
      setProductToEdit(null);
  };

  const handleUpdateProfile = (updatedUser: User) => {
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);
  };

  // User Management
  const handleAddUser = (user: User) => {
      setUsers(prev => [...prev, user]);
  };
  const handleUpdateUser = (user: User) => {
      setUsers(prev => prev.map(u => u.id === user.id ? user : u));
  };
  const handleDeleteUser = (id: number) => {
      setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Product Management
  const handleAddProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const handleUpdateProduct = (product: Product) => {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Triggers edit mode in dashboards
  const handleEditProductClick = (product: Product) => {
      setProductToEdit(product);
      if (currentUser?.role === UserRole.ADMIN) {
          setCurrentView('admin-products');
      } else if (currentUser?.role === UserRole.MANAGER) {
          setCurrentView('manager-dashboard');
      }
  };

  // Order Management
  const handleCreateOrder = () => {
      const newOrder: Order = {
          id: Date.now(),
          customerName: currentUser?.name || "Гость",
          customerPhone: "+7 (999) 000-00-00", // Mock
          status: 'Pending',
          totalAmount: cart.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0),
          createdAt: new Date().toLocaleString(),
          items: [...cart],
          comments: cartComment ? [{
              id: 1,
              author: currentUser?.name || "Гость",
              text: cartComment,
              createdAt: new Date().toLocaleString(),
              isInternal: false
          }] : []
      };
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setCartComment('');
      alert("Заказ успешно создан!");
      setCurrentView('orders'); // Go to orders view
  };

  const handleUpdateOrder = (order: Order) => {
      setOrders(prev => prev.map(o => o.id === order.id ? order : o));
  };

  const handleDeleteOrder = (id: number) => {
      setOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleOrderStatusUpdate = (orderId: number, status: 'Completed' | 'Processing') => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleAddOrderComment = (orderId: number, text: string, isInternal: boolean, author: string) => {
      const newComment: OrderComment = {
          id: Date.now(),
          author,
          text,
          createdAt: new Date().toLocaleString(),
          isInternal
      };
      setOrders(prev => prev.map(o => {
          if (o.id === orderId) {
              return { ...o, comments: [...o.comments, newComment] };
          }
          return o;
      }));
  };

  // Import Data Logic (Admin Only)
  const handleImportData = (data: { products?: Product[], orders?: Order[], users?: User[] }) => {
      let importedCounts = { products: 0, orders: 0, users: 0 };

      if (data.products && Array.isArray(data.products)) {
          setProducts(prev => {
              const newProducts = [...prev];
              data.products!.forEach(p => {
                  const idx = newProducts.findIndex(existing => existing.id === p.id);
                  if (idx >= 0) newProducts[idx] = p;
                  else newProducts.push(p);
              });
              importedCounts.products = data.products.length;
              return newProducts;
          });
      }

      if (data.orders && Array.isArray(data.orders)) {
          setOrders(prev => {
              const newOrders = [...prev];
              data.orders!.forEach(o => {
                  const idx = newOrders.findIndex(existing => existing.id === o.id);
                  if (idx >= 0) newOrders[idx] = o;
                  else newOrders.push(o);
              });
              importedCounts.orders = data.orders.length;
              return newOrders;
          });
      }

      if (data.users && Array.isArray(data.users)) {
          setUsers(prev => {
              const newUsers = [...prev];
              data.users!.forEach(u => {
                  const idx = newUsers.findIndex(existing => existing.id === u.id);
                  if (idx >= 0) newUsers[idx] = u;
                  else newUsers.push(u);
              });
              importedCounts.users = data.users.length;
              return newUsers;
          });
      }

      alert(`Импорт завершен:\nТоваров: ${importedCounts.products}\nЗаказов: ${importedCounts.orders}\nПользователей: ${importedCounts.users}`);
  };

  // Review Management
  const handleDeleteReview = (id: number) => {
      setReviews(prev => prev.filter(r => r.id !== id));
  };

  const handleReplyReview = (id: number, text: string) => {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: text } : r));
  };

  // Quick Filters
  const handleQuickCategorySelect = (id: number | 'windows') => {
      setCurrentView('catalog');
      setSelectedCategoryId(id);
      setIsSaleOnly(false);
      setExpandedTag(null);
  };
  
  const handleQuickSaleSelect = () => {
      setCurrentView('catalog');
      setIsSaleOnly(true);
      setSelectedCategoryId('all');
  };

  const handleTagSelect = (tagName: string, option: string) => {
      setSelectedTags(prev => {
          if (option === 'Не важно') {
              const newState = { ...prev };
              delete newState[tagName];
              return newState;
          }
          return { ...prev, [tagName]: option };
      });
      setExpandedTag(null);
  };

  const handleResetFilters = () => {
      setDeliveryTime('any');
      setPriceRange({min:0, max:100000});
      setIsSaleOnly(false);
      setSelectedCategoryId('all');
      setSelectedBrands([]);
      setSelectedTags({});
  };

  // Helper for category styling
  const getCategoryClass = (id: number | 'all' | 'windows') => {
      const isActive = selectedCategoryId === id;
      return isActive 
        ? "text-sm text-slate-600 hover:text-blue-600 cursor-pointer bg-slate-100 rounded px-2 -mx-2 py-1 font-semibold text-blue-700"
        : "text-sm text-slate-600 hover:text-blue-600 cursor-pointer";
  };

  const toggleBrand = (brand: string) => {
      setSelectedBrands(prev => 
          prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
      );
  };

  // Views Logic
  const renderAuthWall = () => (
      <div className="max-w-2xl mx-auto text-center py-20 px-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 md:p-10">
              <div className="mb-6 inline-block p-4 bg-blue-50 rounded-full text-blue-600">
                  <i className="fa-solid fa-lock text-4xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Доступ ограничен</h2>
              <p className="text-slate-500 mb-8 text-lg">
                  Войдите в учетную запись или пройдите регистрацию на сайте, чтобы просматривать эту страницу.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                      onClick={() => setCurrentView('login')}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                  >
                      Войти
                  </button>
                  <button 
                      onClick={() => setCurrentView('register')}
                      className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
                  >
                      Регистрация
                  </button>
              </div>
          </div>
      </div>
  );

  const renderFiltersContent = () => (
      <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="font-bold text-slate-900 mb-3">Категория</h3>
                <div className="space-y-2 pl-2 border-l-2 border-slate-200">
                    <div className={getCategoryClass('all')} onClick={() => { setSelectedCategoryId('all'); setShowMobileFilters(false); }}>Весь каталог</div>
                    <div className="pl-4 space-y-1.5">
                         <div className={getCategoryClass('windows')} onClick={() => { setSelectedCategoryId('windows'); setShowMobileFilters(false); }}>Все окна</div>
                        <div className={getCategoryClass(1)} onClick={() => { setSelectedCategoryId(1); setShowMobileFilters(false); }}>Пластиковые окна</div>
                        <div className={getCategoryClass(2)} onClick={() => { setSelectedCategoryId(2); setShowMobileFilters(false); }}>Деревянные окна</div>
                        <div className={getCategoryClass(7)} onClick={() => { setSelectedCategoryId(7); setShowMobileFilters(false); }}>Подоконники</div>
                         <div className={getCategoryClass(8)} onClick={() => { setSelectedCategoryId(8); setShowMobileFilters(false); }}>Наличники</div>
                        <div className={getCategoryClass(9)} onClick={() => { setSelectedCategoryId(9); setShowMobileFilters(false); }}>Крепеж</div>
                        <div className={getCategoryClass(10)} onClick={() => { setSelectedCategoryId(10); setShowMobileFilters(false); }}>Расходные материалы</div>
                        <div className={getCategoryClass(6)} onClick={() => { setSelectedCategoryId(6); setShowMobileFilters(false); }}>Установка и монтаж</div>
                    </div>
                </div>
            </div>

            {/* Sale Toggle */}
            <div className="flex items-center justify-between py-2">
                <span className="font-bold text-slate-900 text-sm">Распродажа года</span>
                <button 
                    onClick={() => setIsSaleOnly(!isSaleOnly)}
                    className={`w-11 h-6 rounded-full relative transition-colors ${isSaleOnly ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isSaleOnly ? 'translate-x-5' : ''}`}></span>
                </button>
            </div>

            {/* Price Filter (Simple) */}
            <div>
                 <h3 className="font-bold text-slate-900 mb-3">Цена, ₽</h3>
                 <div className="flex gap-2 mb-4">
                     <input 
                        type="number" 
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm bg-white"
                        placeholder="от"
                     />
                     <span className="text-slate-400">–</span>
                     <input 
                        type="number" 
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                        className="w-full border border-slate-300 rounded px-2 py-1 text-sm bg-white"
                        placeholder="до"
                     />
                 </div>
            </div>

            {/* Brand Filter */}
             <div>
                <h3 className="font-bold text-slate-900 mb-3">Бренд</h3>
                <div className="space-y-2">
                    {['Rehau', 'Veka', 'KBE', 'Brusbox', 'Montblanc'].map(brand => (
                        <label key={brand} className="flex items-center text-sm cursor-pointer hover:text-blue-600">
                             <input 
                                type="checkbox" 
                                className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => toggleBrand(brand)}
                             />
                             {brand}
                        </label>
                    ))}
                </div>
            </div>
      </div>
  );

  const renderCatalog = () => {
    const filteredProducts = products.filter(p => {
      const matchesCategory = 
          selectedCategoryId === 'all' 
          || (selectedCategoryId === 'windows' && [1, 2, 3].includes(p.categoryId))
          || p.categoryId === selectedCategoryId;

      const matchesPrice = p.basePrice >= priceRange.min && p.basePrice <= priceRange.max;
      const matchesSale = isSaleOnly ? p.isSale : true;
      const matchesDelivery = deliveryTime === 'any' ? true : 
                              deliveryTime === '1h' ? p.deliveryTime === '1 час' :
                              deliveryTime === 'today' ? p.deliveryTime === 'Сегодня' :
                              deliveryTime === 'tomorrow' ? p.deliveryTime === 'Завтра' :
                              deliveryTime === '3days' ? ['Завтра', 'Сегодня', 'До 3 дней'].includes(p.deliveryTime || '') : 
                              true;
      
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.some(brand => 
          p.name.includes(brand) || p.frameMaterial.includes(brand)
      );

      const matchesTags = Object.entries(selectedTags).every(([key, value]) => {
         const searchStr = (p.name + p.description + p.frameMaterial + p.glassType).toLowerCase();
         return searchStr.includes((value as string).toLowerCase());
      });

      return matchesPrice && matchesSale && matchesDelivery && matchesCategory && matchesBrand && matchesTags;
    });

    return (
      <div className="flex gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="w-64 flex-shrink-0 hidden lg:block">
            {renderFiltersContent()}
        </aside>

        {/* Mobile Filters Modal */}
        {showMobileFilters && (
            <div className="fixed inset-0 z-[60] lg:hidden">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
                <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto p-6 animate-fade-in-up">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Фильтры</h2>
                        <button onClick={() => setShowMobileFilters(false)} className="text-slate-400 hover:text-slate-600">
                            <i className="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>
                    {renderFiltersContent()}
                    <div className="mt-8 pt-4 border-t border-slate-100">
                        <button 
                            onClick={() => setShowMobileFilters(false)}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
                        >
                            Показать ({filteredProducts.length})
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Main Content */}
        <div className="flex-1 w-full">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Каталог товаров и услуг</h1>
            <p className="text-sm text-slate-500 mb-6 max-w-3xl hidden md:block">
                Купите готовые окна, комплектующие и закажите профессиональный монтаж в интернет-магазине «НовыеОкна».
            </p>

            {/* Top Filter Tags */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Mobile Filters Toggle */}
                    <button 
                        onClick={() => setShowMobileFilters(true)}
                        className="lg:hidden px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 mr-2"
                    >
                        <i className="fa-solid fa-filter mr-2"></i>
                        Фильтры
                    </button>

                    <div className="hidden md:block text-sm font-bold text-slate-700 mr-2">Теги:</div>
                    {TAG_OPTIONS.map((tag, idx) => (
                        <div key={idx} className="relative hidden md:block">
                            <button 
                                onClick={() => setExpandedTag(expandedTag === tag.name ? null : tag.name)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border flex items-center
                                    ${selectedTags[tag.name] || expandedTag === tag.name 
                                        ? 'bg-blue-600 text-white border-blue-600' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'}`}
                            >
                                {selectedTags[tag.name] || tag.name}
                                <i className={`fa-solid fa-chevron-down text-xs ml-2 transition-transform ${expandedTag === tag.name ? 'rotate-180' : ''}`}></i>
                            </button>

                            {/* Dropdown */}
                            {expandedTag === tag.name && (
                                <div className="absolute top-full mt-2 left-0 bg-white border border-slate-100 shadow-xl rounded-lg py-2 w-56 z-20 animate-fade-in-up">
                                    <div 
                                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-400"
                                        onClick={() => handleTagSelect(tag.name, 'Не важно')}
                                    >
                                        Не важно
                                    </div>
                                    {tag.options.map(option => (
                                        <div 
                                            key={option}
                                            onClick={() => handleTagSelect(tag.name, option)}
                                            className={`px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm ${selectedTags[tag.name] === option ? 'text-blue-600 font-semibold bg-blue-50' : 'text-slate-700'}`}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {(Object.keys(selectedTags).length > 0 || selectedBrands.length > 0 || deliveryTime !== 'any' || selectedCategoryId !== 'all' || isSaleOnly) && (
                         <button onClick={handleResetFilters} className="px-4 py-1.5 rounded-full text-sm font-medium text-red-500 hover:bg-red-50 transition-colors ml-auto md:ml-0">
                            Сбросить
                        </button>
                    )}
                </div>
            </div>
            
            {/* Sorting */}
            <div className="flex items-center mb-6 justify-between md:justify-start">
                 <div className="relative">
                     <select className="appearance-none bg-white font-medium text-slate-800 pr-8 pl-2 py-1 rounded border border-transparent hover:border-slate-200 cursor-pointer outline-none hover:text-blue-600">
                         <option>Популярные</option>
                         <option>Сначала дешевые</option>
                         <option>Сначала дорогие</option>
                         <option>Новинки</option>
                         <option>Высокий рейтинг</option>
                     </select>
                     <i className="fa-solid fa-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none"></i>
                 </div>
            </div>

            {/* Product Grid - 1 Col on Mobile, 2 on SM, 3 on MD, 4 on LG */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                    <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={handleAddToCart}
                        onViewDetails={handleViewDetails}
                        isFavorite={favorites.includes(product.id)}
                        onToggleFavorite={handleToggleFavorite}
                        userRole={currentUser?.role || UserRole.GUEST}
                        onEdit={handleEditProductClick}
                        onDelete={handleDeleteProduct}
                    />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="py-20 text-center bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                    <p className="text-slate-500 text-lg">Товары в данной категории не найдены</p>
                    <button onClick={handleResetFilters} className="mt-4 text-blue-600 font-medium">Показать все товары</button>
                </div>
            )}
        </div>
      </div>
    );
  };

  const renderFavorites = () => {
      if (!isLoggedIn) return renderAuthWall();

      const favoriteProducts = products.filter(p => favorites.includes(p.id));
      
      return (
          <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <i className="fa-regular fa-heart text-red-500 mr-2"></i>
                  Избранное <span className="text-slate-400 ml-2 text-lg font-normal">{favoriteProducts.length}</span>
              </h2>
              
              {favoriteProducts.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                      <p className="text-slate-500 text-lg">У вас нет избранных товаров</p>
                      <button onClick={() => setCurrentView('catalog')} className="mt-4 text-blue-600 font-medium hover:underline">
                          Перейти в каталог
                      </button>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {favoriteProducts.map(product => (
                          <ProductCard 
                              key={product.id} 
                              product={product} 
                              onAddToCart={handleAddToCart}
                              onViewDetails={handleViewDetails}
                              isFavorite={favorites.includes(product.id)}
                              onToggleFavorite={handleToggleFavorite}
                              userRole={currentUser?.role || UserRole.GUEST}
                              onEdit={handleEditProductClick}
                              onDelete={handleDeleteProduct}
                          />
                      ))}
                  </div>
              )}
          </div>
      );
  };

  const renderClientOrders = () => {
      if (!isLoggedIn) return renderAuthWall();

      // Filter orders where customer matches current user
      const clientOrders = orders.filter(o => o.customerName === currentUser?.name);

      return (
          <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <i className="fa-solid fa-box-open text-blue-600 mr-3"></i>
                  Мои заказы
              </h2>

              {clientOrders.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                      <p className="text-slate-500 text-lg">Вы еще не совершали покупок</p>
                      <button onClick={() => setCurrentView('catalog')} className="mt-4 text-blue-600 font-medium hover:underline">
                          Начать покупки
                      </button>
                  </div>
              ) : (
                  <div className="space-y-6">
                      {clientOrders.map(order => (
                          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                              <div className="bg-slate-50 px-6 py-4 flex flex-wrap justify-between items-center border-b border-slate-200">
                                  <div>
                                      <div className="text-sm font-bold text-slate-800">Заказ №{order.id}</div>
                                      <div className="text-xs text-slate-500">от {order.createdAt}</div>
                                  </div>
                                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                          order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                          order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                          'bg-yellow-100 text-yellow-700'
                                      }`}>
                                          {STATUS_TRANSLATIONS[order.status]}
                                      </span>
                                      <div className="text-lg font-bold text-slate-900">{order.totalAmount.toLocaleString()} ₽</div>
                                  </div>
                              </div>
                              <div className="p-6">
                                  <div className="space-y-4 mb-4">
                                      {order.items.map(item => (
                                          <div key={item.id} className="flex items-center justify-between">
                                              <div className="flex items-center gap-3">
                                                  <div className="w-12 h-12 bg-slate-100 rounded flex-shrink-0">
                                                      <img src={item.imageUrl} alt="" className="w-full h-full object-cover rounded" />
                                                  </div>
                                                  <div>
                                                      <div className="text-sm font-medium text-slate-800">{item.name}</div>
                                                      <div className="text-xs text-slate-500">{item.quantity} шт x {item.basePrice.toLocaleString()} ₽</div>
                                                  </div>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                                  
                                  {order.comments.filter(c => !c.isInternal).length > 0 && (
                                       <div className="mb-4 bg-blue-50 p-3 rounded text-sm">
                                            <div className="font-bold text-slate-700 text-xs mb-1">Комментарии:</div>
                                            {order.comments.filter(c => !c.isInternal).map(c => (
                                                <div key={c.id} className="mb-1 last:mb-0">
                                                    <span className="font-semibold mr-1">{c.author}:</span>
                                                    <span className="text-slate-600">{c.text}</span>
                                                </div>
                                            ))}
                                       </div>
                                  )}

                                  <div className="flex justify-end pt-2">
                                      <button 
                                          onClick={() => {
                                              order.items.forEach(item => handleAddToCart(item));
                                              setCurrentView('cart');
                                          }}
                                          className="text-blue-600 font-medium text-sm hover:underline"
                                      >
                                          Повторить заказ
                                      </button>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      );
  };

  const renderCart = () => {
    if (!isLoggedIn) return renderAuthWall();

    const total = cart.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Корзина</h2>
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 mb-6 text-lg">В вашей корзине пока пусто.</p>
            <button 
                onClick={() => setCurrentView('catalog')} 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
                Перейти в каталог
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {cart.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 last:border-0 last:pb-0 gap-4">
                  <div className="flex items-center space-x-6">
                    <img src={item.imageUrl} alt="" className="w-20 h-20 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <span>{item.basePrice} ₽ x {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="font-bold text-xl text-slate-900">{(item.basePrice * item.quantity).toLocaleString()} ₽</div>
                      <button 
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-2"
                          title="Удалить из корзины"
                      >
                          <i className="fa-solid fa-trash-can text-lg"></i>
                      </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Комментарий к заказу</label>
                <textarea 
                    value={cartComment}
                    onChange={(e) => setCartComment(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ваши пожелания..."
                    rows={3}
                />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center border-t border-slate-100 pt-8 mt-8 gap-4">
              <div className="flex flex-col text-center sm:text-left">
                  <span className="text-sm text-slate-500">Итого</span>
                  <span className="text-3xl font-bold text-slate-900">{total.toLocaleString()} ₽</span>
              </div>
              <button 
                  onClick={handleCreateOrder}
                  className="w-full sm:w-auto bg-blue-600 text-white px-10 py-3 rounded-lg hover:bg-blue-700 transition-all font-bold"
              >
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Layout 
      currentRole={currentUser?.role || UserRole.GUEST} 
      cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
      favoritesCount={favorites.length}
      onNavigate={setCurrentView}
      currentView={currentView}
      onLogout={handleLogout}
      isLoggedIn={isLoggedIn}
      userName={currentUser?.name}
      avatarUrl={currentUser?.avatarUrl}
      onCategorySelect={handleQuickCategorySelect}
      onToggleSale={handleQuickSaleSelect}
    >
      {currentView === 'catalog' && renderCatalog()}
      {currentView === 'cart' && renderCart()}
      {currentView === 'favorites' && renderFavorites()}
      {currentView === 'orders' && renderClientOrders()}
      {currentView === 'profile' && currentUser && (
          <UserProfile 
            user={currentUser} 
            onUpdateProfile={handleUpdateProfile}
          />
      )}
      {currentView === 'login' && (
        <Login 
            onLogin={handleLogin} 
            onNavigateToRegister={() => setCurrentView('register')} 
        />
      )}
      {currentView === 'register' && (
        <Register 
            onRegister={handleLogin} 
            onNavigateToLogin={() => setCurrentView('login')} 
        />
      )}
      {(currentView === 'admin-products' || currentView === 'admin-orders' || currentView === 'admin-users' || currentView === 'admin-reports') && (
        <AdminDashboard 
          activeTab={currentView.replace('admin-', '') as any}
          products={products}
          orders={orders}
          users={users}
          categories={CATEGORIES}
          currentUser={currentUser}
          onNavigate={setCurrentView}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onAddUser={handleAddUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          onUpdateOrder={handleUpdateOrder}
          onDeleteOrder={handleDeleteOrder}
          onAddOrderComment={handleAddOrderComment}
          productToEdit={productToEdit}
          onClearEdit={() => setProductToEdit(null)}
          onImportData={handleImportData}
        />
      )}
      
      {currentView === 'manager-dashboard' && (
          <ManagerDashboard 
            products={products}
            orders={orders}
            reviews={reviews}
            categories={CATEGORIES}
            users={users}
            onUpdateProduct={handleUpdateProduct}
            onUpdateOrder={handleUpdateOrder}
            onDeleteReview={handleDeleteReview}
            onReplyReview={handleReplyReview}
            onAddOrderComment={handleAddOrderComment}
            productToEdit={productToEdit}
            onClearEdit={() => setProductToEdit(null)}
          />
      )}
      
      {currentView === 'assembler-dashboard' && (
          <AssemblerDashboard 
            orders={orders}
            currentUserId={currentUser?.id}
            onUpdateStatus={handleOrderStatusUpdate}
            onUpdateOrder={handleUpdateOrder}
            onAddOrderComment={handleAddOrderComment}
          />
      )}
      
      {currentView === 'product-details' && selectedProduct && (
          <ProductDetails 
            product={selectedProduct}
            reviews={reviews}
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentView('catalog')}
            cartItems={cart}
            userRole={currentUser?.role || UserRole.GUEST}
            onEdit={handleEditProductClick}
            onDelete={handleDeleteProduct}
          />
      )}
    </Layout>
  );
};

export default App;
