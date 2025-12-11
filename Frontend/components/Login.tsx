
import React, { useState } from 'react';
import { UserRole } from '../types';
import { MOCK_USERS, ROLE_TRANSLATIONS } from '../constants';

interface LoginProps {
    onLogin: (name: string, role: UserRole) => void;
    onNavigateToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        const user = MOCK_USERS.find(u => u.email === email && u.password === password);

        if (user) {
            onLogin(user.name, user.role);
        } else {
             setError('Неверный email или пароль (используйте тестовые данные справа)');
        }
    };

    const handleQuickFill = (userIndex: number) => {
        const user = MOCK_USERS[userIndex];
        setEmail(user.email);
        setPassword(user.password || '123');
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 mt-10 items-start animate-fade-in-up">
            {/* Login Form */}
            <div className="flex-1 w-full bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="bg-blue-600 p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4 text-white">
                        <i className="fa-solid fa-user-lock text-xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Авторизация</h2>
                    <p className="text-blue-100 text-sm mt-1">Войдите в свой аккаунт</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
                            <i className="fa-solid fa-circle-exclamation mr-2"></i>
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-200 transition-all"
                    >
                        Войти
                    </button>
                </form>
                
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500">
                        Нет аккаунта? <button onClick={onNavigateToRegister} className="text-blue-600 font-medium hover:underline">Регистрация</button>
                    </p>
                </div>
            </div>

            {/* Test Credentials Helper */}
            <div className="w-full md:w-80 bg-blue-50 rounded-xl border border-blue-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                    <i className="fa-solid fa-key text-blue-500 mr-2"></i>
                    Тестовый доступ
                </h3>
                <div className="space-y-3">
                    {MOCK_USERS.slice(0, 4).map((user, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleQuickFill(idx)}
                            className="bg-white p-3 rounded-lg border border-blue-100 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-xs uppercase text-slate-500 group-hover:text-blue-600">
                                    {ROLE_TRANSLATIONS[user.role]}
                                </span>
                                <i className="fa-solid fa-arrow-right-to-bracket text-slate-300 group-hover:text-blue-500"></i>
                            </div>
                            <div className="text-sm font-medium text-slate-800">{user.email}</div>
                            <div className="text-xs text-slate-400">Пароль: {user.password}</div>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                    Нажмите на карточку пользователя, чтобы автоматически заполнить форму входа.
                </p>
            </div>
        </div>
    );
};
