
import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../types';

interface LayoutProps {
    children: React.ReactNode;
    currentRole: UserRole;
    cartCount: number;
    favoritesCount?: number;
    onNavigate: (view: string) => void;
    currentView: string;
    onLogout: () => void;
    isLoggedIn: boolean;
    userName?: string;
    avatarUrl?: string;
    onCategorySelect?: (id: number | 'windows') => void;
    onToggleSale?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
    children, 
    currentRole, 
    cartCount, 
    favoritesCount = 0,
    onNavigate,
    currentView,
    onLogout,
    isLoggedIn,
    userName,
    avatarUrl,
    onCategorySelect,
    onToggleSale
}) => {
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const catalogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (catalogRef.current && !catalogRef.current.contains(event.target as Node)) {
                setIsCatalogOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCatalogItemClick = (id: number | 'windows') => {
        onCategorySelect?.(id);
        setIsCatalogOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            {/* Main Header */}
            <header className="sticky top-0 z-50 shadow-sm">
                <div className="bg-blue-600 text-white pb-3 pt-2">
                    <div className="max-w-[1400px] mx-auto px-4 xl:px-8">
                        {/* Top Row: Logo, Catalog, User Icons (Mobile: Search is below) */}
                        <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4 md:h-14">
                            
                            <div className="flex items-center gap-4">
                                {/* Logo */}
                                <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('catalog')}>
                                    <span className="font-bold text-xl md:text-2xl tracking-tighter italic">НовыеОкна</span>
                                </div>

                                {/* Catalog Button & Dropdown */}
                                <div className="relative flex-shrink-0" ref={catalogRef}>
                                    <button 
                                        onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                                        className={`bg-blue-700 hover:bg-blue-800 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors ${isCatalogOpen ? 'bg-blue-800' : ''}`}
                                    >
                                        {isCatalogOpen ? <i className="fa-solid fa-xmark md:mr-2.5 w-4"></i> : <i className="fa-solid fa-bars md:mr-2.5 w-4"></i>}
                                        <span className="hidden md:inline">Каталог</span>
                                    </button>
                                    
                                    {isCatalogOpen && (
                                        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-3 z-50 text-slate-800 animate-fade-in-up">
                                            <div className="flex flex-col">
                                                <button onClick={() => handleCatalogItemClick('windows')} className="px-5 py-3 text-left hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors flex items-center group">
                                                    <i className="fa-solid fa-table-cells-large w-6 text-slate-400 group-hover:text-blue-500"></i>
                                                    Окна
                                                </button>
                                                <button onClick={() => handleCatalogItemClick(7)} className="px-5 py-3 text-left hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors flex items-center group">
                                                    <i className="fa-solid fa-layer-group w-6 text-slate-400 group-hover:text-blue-500"></i>
                                                    Подоконники
                                                </button>
                                                <button onClick={() => handleCatalogItemClick(8)} className="px-5 py-3 text-left hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors flex items-center group">
                                                    <i className="fa-solid fa-border-all w-6 text-slate-400 group-hover:text-blue-500"></i>
                                                    Наличники
                                                </button>
                                                <button onClick={() => handleCatalogItemClick(9)} className="px-5 py-3 text-left hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors flex items-center group">
                                                    <i className="fa-solid fa-screwdriver w-6 text-slate-400 group-hover:text-blue-500"></i>
                                                    Крепежные изделия
                                                </button>
                                                <button onClick={() => handleCatalogItemClick(10)} className="px-5 py-3 text-left hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors flex items-center group">
                                                    <i className="fa-solid fa-spray-can w-6 text-slate-400 group-hover:text-blue-500"></i>
                                                    Расходные материалы
                                                </button>
                                                <div className="my-1 border-t border-slate-100"></div>
                                                <button onClick={() => handleCatalogItemClick(6)} className="px-5 py-3 text-left hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors flex items-center group">
                                                    <i className="fa-solid fa-helmet-safety w-6 text-slate-400 group-hover:text-blue-500"></i>
                                                    Услуги установки под ключ
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Search Bar - White Theme (Full width on mobile, center on desktop) */}
                            <div className="order-last md:order-none w-full md:flex-1 md:max-w-3xl relative md:mx-4">
                                <div className="flex w-full bg-white rounded-lg shadow-sm border border-transparent focus-within:border-blue-300 overflow-hidden transition-all">
                                    <input 
                                        type="text" 
                                        placeholder="Искать товары..." 
                                        className="flex-1 px-4 py-2.5 text-slate-800 outline-none placeholder-slate-400 text-sm bg-white min-w-0"
                                    />
                                    <button className="bg-white hover:bg-slate-50 text-slate-400 hover:text-blue-600 px-4 md:px-5 flex items-center justify-center border-l border-slate-100 transition-colors">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                </div>
                            </div>

                            {/* User Actions */}
                            <div className="flex items-center gap-4 md:gap-6 ml-auto flex-shrink-0">
                                {isLoggedIn ? (
                                     <div className="flex flex-col items-center cursor-pointer group relative" onClick={() => onNavigate('profile')}>
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt={userName} className="w-6 h-6 rounded-full object-cover mb-1 border border-blue-400" />
                                        ) : (
                                            <i className={`fa-regular ${currentRole === UserRole.ADMIN ? 'fa-user-shield text-yellow-300' : currentRole === UserRole.ASSEMBLER ? 'fa-helmet-safety text-orange-300' : currentRole === UserRole.MANAGER ? 'fa-user-tie text-purple-300' : 'fa-user'} text-xl mb-1 group-hover:scale-110 transition-transform`}></i>
                                        )}
                                        <span className="text-[10px] font-medium max-w-[60px] truncate hidden md:inline">{userName}</span>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onLogout(); }} 
                                            className="absolute -bottom-6 text-xs text-blue-200 hover:text-white z-50 whitespace-nowrap hidden md:block"
                                        >
                                            Выйти
                                        </button>
                                     </div>
                                ) : (
                                    <div className="flex flex-col items-center cursor-pointer group" onClick={() => onNavigate('login')}>
                                        <i className="fa-regular fa-user text-xl mb-1 group-hover:scale-110 transition-transform"></i>
                                        <span className="text-[10px] font-medium hidden md:inline">Войти</span>
                                    </div>
                                )}
                                
                                {/* Role Based Links in Header */}
                                {currentRole === UserRole.ADMIN && (
                                    <div className="flex flex-col items-center cursor-pointer group" onClick={() => onNavigate('admin-products')}>
                                        <i className="fa-solid fa-screwdriver-wrench text-xl mb-1 group-hover:scale-110 transition-transform text-white"></i>
                                        <span className="text-[10px] font-medium hidden md:inline">Админка</span>
                                    </div>
                                )}
                                {currentRole === UserRole.MANAGER && (
                                    <div className="flex flex-col items-center cursor-pointer group" onClick={() => onNavigate('manager-dashboard')}>
                                        <i className="fa-solid fa-briefcase text-xl mb-1 group-hover:scale-110 transition-transform text-white"></i>
                                        <span className="text-[10px] font-medium hidden md:inline">Кабинет</span>
                                    </div>
                                )}
                                {currentRole === UserRole.ASSEMBLER && (
                                    <div className="flex flex-col items-center cursor-pointer group" onClick={() => onNavigate('assembler-dashboard')}>
                                        <i className="fa-solid fa-hammer text-xl mb-1 group-hover:scale-110 transition-transform text-white"></i>
                                        <span className="text-[10px] font-medium hidden md:inline">Задания</span>
                                    </div>
                                )}

                                {/* Client Only Links */}
                                {[UserRole.CLIENT, UserRole.GUEST].includes(currentRole) && (
                                    <>
                                        <div className="flex flex-col items-center cursor-pointer group" onClick={() => onNavigate('orders')}>
                                            <i className="fa-solid fa-box-open text-xl mb-1 group-hover:scale-110 transition-transform"></i>
                                            <span className="text-[10px] font-medium hidden md:inline">Заказы</span>
                                        </div>
                                        <div className="flex flex-col items-center cursor-pointer group relative" onClick={() => onNavigate('favorites')}>
                                            <div className="relative">
                                                <i className="fa-regular fa-heart text-xl mb-1 group-hover:scale-110 transition-transform"></i>
                                                {favoritesCount > 0 && (
                                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border border-blue-600 min-w-[16px] text-center">
                                                        {favoritesCount}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-medium hidden md:inline">Избранное</span>
                                        </div>

                                        <div className="flex flex-col items-center cursor-pointer group relative" onClick={() => onNavigate('cart')}>
                                            <div className="relative">
                                                <i className="fa-solid fa-basket-shopping text-xl mb-1 group-hover:scale-110 transition-transform"></i>
                                                {cartCount > 0 && (
                                                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1 rounded-full border border-blue-600 min-w-[16px] text-center">
                                                        {cartCount}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-medium hidden md:inline">Корзина</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Bottom Row: Quick Links (Scrollable on mobile) */}
                        <div className="flex justify-between items-center text-xs font-medium mt-3">
                            <div className="flex space-x-4 md:space-x-6 overflow-x-auto pb-1 scrollbar-hide w-full">
                                <a 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); onToggleSale?.(); }}
                                    className="flex items-center text-white whitespace-nowrap hover:opacity-80 transition-opacity"
                                >
                                    <i className="fa-solid fa-fire mr-1.5 text-yellow-300"></i> Распродажа
                                </a>
                                <a 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); onCategorySelect?.('windows'); }}
                                    className="text-white/90 hover:text-white whitespace-nowrap transition-colors"
                                >
                                    Все окна
                                </a>
                                <a 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); onCategorySelect?.(4); }}
                                    className="text-white/90 hover:text-white whitespace-nowrap transition-colors"
                                >
                                    Фурнитура
                                </a>
                                <a 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); onCategorySelect?.(5); }}
                                    className="text-white/90 hover:text-white whitespace-nowrap transition-colors"
                                >
                                    Москитные сетки
                                </a>
                                <a 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); onCategorySelect?.(7); }}
                                    className="text-white/90 hover:text-white whitespace-nowrap transition-colors"
                                >
                                    Подоконники
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 xl:px-8 py-4 md:py-6">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-slate-200 mt-auto">
                <div className="max-w-[1400px] mx-auto py-8 px-4 text-center text-slate-400 text-sm">
                    &copy; 2025 Новые Окна Marketplace. Все права защищены.
                </div>
            </footer>
        </div>
    );
};
