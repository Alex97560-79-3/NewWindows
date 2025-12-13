import React, { useState } from 'react';
import { login as apiLogin, setAuthToken } from '../services/Api.ts';

interface LoginProps {
    onLogin: (name: string, role: string, token: string) => void;
    onNavigateToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        setLoading(true);

        try {
            // Limpiar cualquier token antiguo antes de intentar login
            localStorage.removeItem('token');
            
            // API ahora retorna { data: { token, user } }
            const response = await apiLogin(email, password);
            const { token, user } = response.data;
            
            if (token && user) {
                setAuthToken(token);
                onLogin(user.name, user.role, token);
            } else {
                setError('Неверный ответ от сервера');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Ошибка авторизации';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 animate-fade-in-up">
            {/* Login Form */}
            <div className="w-full bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
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

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                        <p className="font-semibold mb-2">Учетные данные для входа:</p>
                        <p>Все пользователи: пароль <strong>123456</strong></p>
                        <p>admin@example.com, manager@example.com,</p>
                        <p>assembler@example.com, client@example.com</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                Вход...
                            </>
                        ) : (
                            'Войти'
                        )}
                    </button>
                </form>
                
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-500">
                        Нет аккаунта? <button onClick={onNavigateToRegister} className="text-blue-600 font-medium hover:underline">Регистрация</button>
                    </p>
                </div>
            </div>
        </div>
    );
};