import React, { useState } from 'react';
import { register as apiRegister, setAuthToken } from '../services/Api.ts';

interface RegisterProps {
    onRegister: (name: string, role: string, token: string) => void;
    onNavigateToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onNavigateToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !confirmPassword) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        if (password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return;
        }

        setLoading(true);

        try {
            // API теперь возвращает { token, user } напрямую из res.data.data
            const { token, user } = await apiRegister(name, email, password);
            
            if (token && user) {
                setAuthToken(token);
                onRegister(user.name, user.role, token);
            } else {
                setError('Неверный ответ от сервера');
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Ошибка регистрации';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden mt-10 animate-fade-in-up">
            <div className="bg-blue-600 p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4 text-white">
                    <i className="fa-solid fa-user-plus text-xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-white">Регистрация</h2>
                <p className="text-blue-100 text-sm mt-1">Создайте новый аккаунт</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
                        <i className="fa-solid fa-circle-exclamation mr-2"></i>
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Имя</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                        placeholder="Ваше имя"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                        placeholder="name@example.com"
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
                    <p className="text-xs text-slate-400 mt-1">Минимум 6 символов</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Подтвердите пароль</label>
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
                        placeholder="••••••••"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-200 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                            Регистрация...
                        </>
                    ) : (
                        'Зарегистрироваться'
                    )}
                </button>
            </form>
            
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500">
                    Уже есть аккаунт? <button onClick={onNavigateToLogin} className="text-blue-600 font-medium hover:underline">Войти</button>
                </p>
            </div>
        </div>
    );
};