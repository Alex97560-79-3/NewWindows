
import React, { useState } from 'react';
import { User } from '../types';

interface UserProfileProps {
    user: User;
    onUpdateProfile: (updatedUser: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdateProfile }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile({ ...user, name, email, avatarUrl });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 4000);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-100 p-8 mt-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <i className="fa-solid fa-user-gear text-blue-600 mr-3"></i>
                Настройки профиля
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full border-4 border-blue-50 overflow-hidden shadow-sm relative group bg-slate-100">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <i className="fa-solid fa-user text-5xl"></i>
                            </div>
                        )}
                    </div>
                    <div className="text-center w-full">
                         <label className="block text-xs font-medium text-slate-700 mb-1">URL Аватарки</label>
                         <input 
                            type="text" 
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full text-xs border border-slate-300 rounded px-2 py-1 bg-white"
                        />
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Имя</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Роль</label>
                        <input 
                            type="text" 
                            value={user.role}
                            disabled
                            className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-lg px-4 py-2 cursor-not-allowed font-medium"
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center"
                        >
                            {isSaved ? (
                                <>
                                    <i className="fa-solid fa-check mr-2"></i>
                                    Сохранено
                                </>
                            ) : (
                                'Сохранить изменения'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
