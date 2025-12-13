
import React, { useState, useEffect } from 'react';
import { Product, Order, Category, User} from '../types';
import { ROLE_TRANSLATIONS, STATUS_TRANSLATIONS } from '../constants';

interface AdminDashboardProps {
    products: Product[];
    orders: Order[];
    users: User[];
    categories: Category[];
    currentUser: User | null;
    onNavigate: (view: string) => void;

    onAddProduct: (product: Product) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (id: number) => void;
    
    // Edit Product State from Parent
    productToEdit: Product | null;
    onClearEdit: () => void;

    // User Management
    onAddUser: (user: User) => void;
    onUpdateUser: (user: User) => void;
    onDeleteUser: (id: number) => void;

    // Order Management
    onUpdateOrder: (order: Order) => void;
    onDeleteOrder: (id: number) => void;
    onAddOrderComment: (orderId: number, text: string, isInternal: boolean, author: string) => void;

    // Data Import
    onImportData: (data: { products?: Product[], orders?: Order[], users?: User[] }) => void;

    activeTab: 'products' | 'orders' | 'users' | 'reports';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    products, 
    orders, 
    users,
    categories,
    currentUser,
    onNavigate,
    onAddProduct, 
    onUpdateProduct,
    onDeleteProduct,
    productToEdit,
    onClearEdit,
    onAddUser,
    onUpdateUser,
    onDeleteUser,
    onUpdateOrder,
    onDeleteOrder,
    onAddOrderComment,
    onImportData,
    activeTab
}) => {
    // Product State
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '', basePrice: 0, categoryId: 1, width: 0, height: 0,
        frameMaterial: 'ПВХ', glassType: 'Двойной пакет', chambersCount: 3,
        description: '', imageUrl: 'https://picsum.photos/400/400'
    });

    // Load product to edit if passed from parent
    useEffect(() => {
        if (productToEdit) {
            setNewProduct(productToEdit);
        }
    }, [productToEdit]);

    // User State
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [newUser, setNewUser] = useState<Partial<User>>({
        email: '', name: '', password: '', role: UserRole.CLIENT, avatarUrl: ''
    });

    // Order Editing State
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [commentText, setCommentText] = useState('');
    const [commentType, setCommentType] = useState<'internal' | 'public'>('internal');

    // --- Product Handlers ---
    const handleProductSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProduct.name) {
            if (productToEdit && newProduct.id) {
                // Update existing
                onUpdateProduct(newProduct as Product);
                onClearEdit(); // Clear parent state
            } else {
                // Add new
                onAddProduct({ ...newProduct as Product, id: Date.now() });
            }
            
            // Reset form
            setNewProduct({
                name: '', basePrice: 0, categoryId: 1, width: 0, height: 0,
                frameMaterial: 'ПВХ', glassType: 'Двойной пакет', chambersCount: 3,
                description: '', imageUrl: 'https://picsum.photos/400/400'
            });
        }
    };
    
    const handleCancelEdit = () => {
        onClearEdit();
        setNewProduct({
             name: '', basePrice: 0, categoryId: 1, width: 0, height: 0,
             frameMaterial: 'ПВХ', glassType: 'Двойной пакет', chambersCount: 3,
             description: '', imageUrl: 'https://picsum.photos/400/400'
        });
    };

    // --- User Handlers ---
    const handleUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            onUpdateUser({ ...editingUser, ...newUser as User });
            setEditingUser(null);
        } else {
            if (newUser.email && newUser.password && newUser.name) {
                onAddUser({ ...newUser as User, id: Date.now() });
            }
        }
        setNewUser({ email: '', name: '', password: '', role: UserRole.CLIENT, avatarUrl: '' });
    };

    const startEditUser = (user: User) => {
        setEditingUser(user);
        setNewUser({ ...user });
    };

    // --- Order Handlers ---
    const handleAddComment = (orderId: number) => {
        if (!commentText.trim()) return;
        onAddOrderComment(orderId, commentText, commentType === 'internal', "Администратор");
        setCommentText('');
    };

    const handleUpdateOrderItemQuantity = (order: Order, itemId: number, delta: number) => {
        const updatedItems = order.items.map(item => {
            if (item.id === itemId) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0);
        
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
        onUpdateOrder({ ...order, items: updatedItems, totalAmount: newTotal });
    };

    // --- Reports Handlers ---
    const handleExportCSV = () => {
        const headers = ['ID заказа', 'Клиент', 'Телефон', 'Статус', 'Сумма', 'Дата'];
        const rows = orders.map(o => [
            o.id,
            o.customerName,
            o.customerPhone,
            STATUS_TRANSLATIONS[o.status] || o.status,
            o.totalAmount,
            o.createdAt
        ]);
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "orders_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ orders, products, users }, null, 2));
        const link = document.createElement("a");
        link.setAttribute("href", dataStr);
        link.setAttribute("download", "full_backup.json");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrintPDF = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Отчет по заказам</title>');
            printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; font-family: sans-serif; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h1>Отчет по заказам</h1>');
            printWindow.document.write('<table><thead><tr><th>ID</th><th>Клиент</th><th>Статус</th><th>Сумма</th><th>Дата</th></tr></thead><tbody>');
            
            orders.forEach(o => {
                printWindow.document.write(`<tr><td>${o.id}</td><td>${o.customerName}</td><td>${STATUS_TRANSLATIONS[o.status] || o.status}</td><td>${o.totalAmount} ₽</td><td>${o.createdAt}</td></tr>`);
            });
            
            printWindow.document.write('</tbody></table>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        if (e.target.files && e.target.files[0]) {
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target?.result as string);
                    onImportData(jsonData);
                } catch (error) {
                    alert("Ошибка при чтении файла. Убедитесь, что это корректный JSON.");
                }
            };
        }
    };

    // --- Render Content ---

    const renderTabs = () => (
        <div className="flex flex-wrap gap-1 bg-slate-200 p-1 rounded-lg mb-6 w-full md:w-fit">
            <button 
                onClick={() => onNavigate('admin-products')}
                className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
                Товары
            </button>
            <button 
                onClick={() => onNavigate('admin-orders')}
                className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
                Заказы
            </button>
            <button 
                onClick={() => onNavigate('admin-users')}
                className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
                Люди
            </button>
            <button 
                onClick={() => onNavigate('admin-reports')}
                className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
                Отчеты
            </button>
        </div>
    );

    const renderUsersTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow border border-slate-200 p-6">
                <h2 className="text-xl font-bold mb-4">Пользователи</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Имя</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Роль</th>
                                <th className="px-4 py-3 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(user => {
                                const isCurrentUser = currentUser?.id === user.id;
                                return (
                                    <tr key={user.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium flex items-center gap-2 whitespace-nowrap">
                                            {user.avatarUrl && <img src={user.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />}
                                            {user.name}
                                            {isCurrentUser && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded ml-1">Вы</span>}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">{user.email}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                user.role === UserRole.ADMIN ? 'bg-red-100 text-red-800' :
                                                user.role === UserRole.ASSEMBLER ? 'bg-orange-100 text-orange-800' :
                                                user.role === UserRole.MANAGER ? 'bg-purple-100 text-purple-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {ROLE_TRANSLATIONS[user.role] || user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                                            {!isCurrentUser && (
                                                <>
                                                    <button onClick={() => startEditUser(user)} className="text-blue-600 hover:text-blue-800" title="Редактировать">
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button onClick={() => user.id && onDeleteUser(user.id)} className="text-red-500 hover:text-red-700" title="Удалить">
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-slate-200 p-6 h-fit sticky top-24">
                <h2 className="text-xl font-bold mb-4">{editingUser ? 'Редактировать' : 'Новый пользователь'}</h2>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Имя</label>
                        <input 
                            type="text" required
                            value={newUser.name}
                            onChange={e => setNewUser({...newUser, name: e.target.value})}
                            className="w-full bg-white border-slate-300 rounded-md shadow-sm text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" required
                            value={newUser.email}
                            onChange={e => setNewUser({...newUser, email: e.target.value})}
                            className="w-full bg-white border-slate-300 rounded-md shadow-sm text-sm p-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Пароль</label>
                        <input 
                            type="text" required={!editingUser}
                            value={newUser.password}
                            onChange={e => setNewUser({...newUser, password: e.target.value})}
                            className="w-full bg-white border-slate-300 rounded-md shadow-sm text-sm p-2 border"
                            placeholder={editingUser ? "Оставьте пустым, если не меняете" : ""}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Ссылка на аватар</label>
                        <input 
                            type="text"
                            value={newUser.avatarUrl || ''}
                            onChange={e => setNewUser({...newUser, avatarUrl: e.target.value})}
                            className="w-full bg-white border-slate-300 rounded-md shadow-sm text-sm p-2 border"
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Роль</label>
                        <select 
                            value={newUser.role}
                            onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
                            className="w-full bg-white border-slate-300 rounded-md shadow-sm text-sm p-2 border"
                        >
                            {Object.values(UserRole).map(role => (
                                <option key={role} value={role}>{ROLE_TRANSLATIONS[role]}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                            {editingUser ? 'Сохранить' : 'Создать'}
                        </button>
                        {editingUser && (
                            <button 
                                type="button" 
                                onClick={() => { setEditingUser(null); setNewUser({ email: '', name: '', password: '', role: UserRole.CLIENT, avatarUrl: '' }); }}
                                className="bg-slate-200 text-slate-700 px-3 rounded-md hover:bg-slate-300"
                            >
                                Отмена
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );

    const renderOrdersTab = () => (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Управление заказами</h2>
            </div>
            
            <div className="space-y-6">
                {orders.map(order => (
                    <div key={order.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                        {/* Order Header */}
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-200">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-lg font-bold text-slate-700">#{order.id}</span>
                                    <select 
                                        value={order.status}
                                        onChange={(e) => onUpdateOrder({...order, status: e.target.value as any})}
                                        className="bg-white text-xs border border-slate-300 rounded px-2 py-1 font-bold"
                                    >
                                        <option value="Pending">{STATUS_TRANSLATIONS['Pending']}</option>
                                        <option value="Processing">{STATUS_TRANSLATIONS['Processing']}</option>
                                        <option value="Completed">{STATUS_TRANSLATIONS['Completed']}</option>
                                        <option value="Cancelled">{STATUS_TRANSLATIONS['Cancelled']}</option>
                                    </select>
                                </div>
                                <div className="text-sm text-slate-600 mt-1">
                                    <span className="font-bold">{order.customerName}</span> ({order.customerPhone})
                                </div>
                                <div className="text-xs text-slate-400">{order.createdAt}</div>
                            </div>
                            
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <span className="text-sm text-slate-500">Итого:</span>
                                    <input 
                                        type="number"
                                        value={order.totalAmount}
                                        onChange={(e) => onUpdateOrder({...order, totalAmount: Number(e.target.value)})}
                                        className="w-24 bg-white border border-slate-300 rounded px-2 py-1 text-right font-bold text-lg"
                                    />
                                    <span className="font-bold text-lg">₽</span>
                                </div>
                                <button 
                                    onClick={() => onDeleteOrder(order.id)}
                                    className="text-red-500 text-xs hover:underline mt-2"
                                >
                                    Удалить заказ
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Items Section */}
                            <div>
                                <h4 className="font-bold text-sm text-slate-700 mb-2">Состав заказа</h4>
                                <div className="bg-white rounded border border-slate-200 overflow-hidden">
                                    {order.items.map(item => (
                                        <div key={item.id} className="flex justify-between items-center p-3 border-b border-slate-100 last:border-0">
                                            <div className="text-sm">
                                                <div className="font-medium text-slate-800">{item.name}</div>
                                                <div className="text-xs text-slate-500">{item.basePrice} ₽/шт</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleUpdateOrderItemQuantity(order, item.id, -1)}
                                                    className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center hover:bg-slate-200"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-mono w-4 text-center">{item.quantity}</span>
                                                <button 
                                                        onClick={() => handleUpdateOrderItemQuantity(order, item.id, 1)}
                                                        className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center hover:bg-slate-200"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="flex flex-col h-full">
                                <h4 className="font-bold text-sm text-slate-700 mb-2">Комментарии</h4>
                                <div className="flex-1 bg-white border border-slate-200 rounded mb-3 p-3 max-h-40 overflow-y-auto">
                                    {order.comments.length === 0 ? (
                                        <p className="text-xs text-slate-400 italic">Нет комментариев</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {order.comments.map(comment => (
                                                <div key={comment.id} className={`p-2 rounded text-xs ${comment.isInternal ? 'bg-yellow-50 border border-yellow-100' : 'bg-blue-50 border border-blue-100'}`}>
                                                    <div className="flex justify-between mb-1">
                                                        <span className="font-bold">{comment.author}</span>
                                                        <span className="text-[10px] text-slate-400">
                                                            {comment.isInternal && <i className="fa-solid fa-lock mr-1" title="Внутренний"></i>}
                                                            {comment.createdAt}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-700">{comment.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={editingOrderId === order.id ? commentText : ''}
                                        onChange={(e) => { setEditingOrderId(order.id); setCommentText(e.target.value); }}
                                        placeholder="Комментарий..."
                                        className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-sm"
                                    />
                                    <select 
                                        value={commentType} 
                                        onChange={(e) => setCommentType(e.target.value as any)}
                                        className="bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                                    >
                                        <option value="internal">Скрытый</option>
                                        <option value="public">Публичный</option>
                                    </select>
                                    <button 
                                        onClick={() => handleAddComment(order.id)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                    >
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderProductsTab = () => (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product List */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow border border-slate-200 p-6">
                <h2 className="text-xl font-bold mb-4">Инвентарь</h2>
                <div className="space-y-4">
                    {products.map(product => (
                        <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 gap-4">
                            <div className="flex items-center space-x-4">
                                <img src={product.imageUrl} alt="" className="w-12 h-12 rounded object-cover" />
                                <div>
                                    <h4 className="font-semibold text-slate-800">{product.name}</h4>
                                    <div className="text-xs text-slate-500">
                                        {product.width}x{product.height} | {product.frameMaterial}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 justify-end">
                                <span className="font-mono font-medium">{product.basePrice} ₽</span>
                                <button 
                                    onClick={() => { setNewProduct(product); onClearEdit(); }}
                                    className="text-blue-500 hover:text-blue-700 p-2"
                                    title="Редактировать"
                                >
                                    <i className="fa-solid fa-pen"></i>
                                </button>
                                <button 
                                    onClick={() => onDeleteProduct(product.id)}
                                    className="text-red-500 hover:text-red-700 p-2"
                                    title="Удалить"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add/Edit Product Form */}
            <div className="bg-white rounded-lg shadow border border-slate-200 p-6 h-fit sticky top-24">
                <h2 className="text-xl font-bold mb-4">{productToEdit || newProduct.id ? 'Редактировать товар' : 'Добавить товар'}</h2>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Название</label>
                        <input 
                            type="text" required
                            value={newProduct.name}
                            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                            className="w-full bg-white border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Категория</label>
                            <select 
                                value={newProduct.categoryId}
                                onChange={e => setNewProduct({...newProduct, categoryId: Number(e.target.value)})}
                                className="w-full bg-white border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                            >
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Цена (₽)</label>
                            <input 
                                type="number" required
                                value={newProduct.basePrice}
                                onChange={e => setNewProduct({...newProduct, basePrice: Number(e.target.value)})}
                                className="w-full bg-white border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Материал</label>
                            <input 
                                type="text"
                                value={newProduct.frameMaterial}
                                onChange={e => setNewProduct({...newProduct, frameMaterial: e.target.value})}
                                className="w-full bg-white border-slate-300 rounded-md shadow-sm text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Тип стекла</label>
                            <input 
                                type="text"
                                value={newProduct.glassType}
                                onChange={e => setNewProduct({...newProduct, glassType: e.target.value})}
                                className="w-full bg-white border-slate-300 rounded-md shadow-sm text-sm p-2 border"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-medium text-slate-700">Описание</label>
                        </div>
                        <textarea 
                            value={newProduct.description}
                            onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                            rows={3}
                            className="w-full bg-white border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Ссылка на изображение</label>
                        <input 
                            type="text"
                            value={newProduct.imageUrl || ''}
                            onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
                            className="w-full bg-white border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex gap-2">
                         <button 
                            type="submit" 
                            className="flex-1 bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            {productToEdit || newProduct.id ? 'Сохранить изменения' : 'Создать товар'}
                        </button>
                        {(productToEdit || newProduct.id) && (
                             <button 
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-slate-200 text-slate-700 px-3 rounded-md hover:bg-slate-300"
                            >
                                Отмена
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );

    const renderReportsTab = () => (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
             <h2 className="text-xl font-bold mb-6">Отчеты и Экспорт</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-slate-200 rounded-lg p-5 hover:bg-slate-50 transition-colors">
                    <div className="text-3xl text-green-600 mb-3"><i className="fa-solid fa-file-csv"></i></div>
                    <h3 className="font-bold text-lg mb-2">Экспорт CSV</h3>
                    <p className="text-sm text-slate-500 mb-4">Скачать данные о заказах в формате CSV для Excel.</p>
                    <button onClick={handleExportCSV} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">Скачать CSV</button>
                </div>

                <div className="border border-slate-200 rounded-lg p-5 hover:bg-slate-50 transition-colors">
                    <div className="text-3xl text-blue-600 mb-3"><i className="fa-solid fa-file-code"></i></div>
                    <h3 className="font-bold text-lg mb-2">Резервная копия JSON</h3>
                    <p className="text-sm text-slate-500 mb-4">Полный дамп базы данных (товары, заказы, пользователи).</p>
                    <button onClick={handleExportJSON} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Скачать JSON</button>
                </div>

                <div className="border border-slate-200 rounded-lg p-5 hover:bg-slate-50 transition-colors">
                    <div className="text-3xl text-red-600 mb-3"><i className="fa-solid fa-print"></i></div>
                    <h3 className="font-bold text-lg mb-2">Печать отчета</h3>
                    <p className="text-sm text-slate-500 mb-4">Версия для печати или сохранения в PDF.</p>
                    <button onClick={handlePrintPDF} className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">Печать (PDF)</button>
                </div>
             </div>

             <div className="mt-8 border-t border-slate-200 pt-8">
                <h3 className="font-bold text-lg mb-4">Импорт данных</h3>
                <div className="max-w-md">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Загрузить JSON файл</label>
                    <input 
                        type="file" 
                        accept=".json"
                        onChange={handleFileImport}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-slate-400 mt-2">Внимание: Импорт объединит данные из файла с текущими данными.</p>
                </div>
             </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                 <h1 className="text-2xl font-bold text-slate-900">Административная панель</h1>
            </div>

            {renderTabs()}

            {activeTab === 'users' && renderUsersTab()}
            {activeTab === 'orders' && renderOrdersTab()}
            {activeTab === 'products' && renderProductsTab()}
            {activeTab === 'reports' && renderReportsTab()}
        </div>
    );
};
