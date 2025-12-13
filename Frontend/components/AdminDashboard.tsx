
import React, { useState, useEffect } from 'react';
import { Product, Order, Category, User, Review, UserRole } from '../types';
import { STATUS_TRANSLATIONS, ACCEPTANCE_TRANSLATIONS } from '../constants';

interface AdminDashboardProps {
    products: Product[];
    orders: Order[];
    reviews?: Review[];
    categories?: Category[];
    users?: User[];

    // Actions
    onAddProduct?: (product: Product) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct?: (id: number) => void;
    onUpdateOrder?: (order: Order) => void;
    onUpdateOrderStatus?: (orderId: number, status: string) => void;
    onDeleteReview?: (id: number) => void;
    onReplyReview?: (id: number, text: string) => void;
    onAddOrderComment?: (orderId: number, text: string, isInternal: boolean, author: string) => void;
    onDeleteUser?: (id: number) => void;

    // Edit state from parent
    productToEdit?: Product | null;
    onClearEdit?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    products,
    orders,
    reviews = [],
    categories = [],
    users = [],
    onUpdateProduct,
    onUpdateOrder,
    onDeleteReview,
    onReplyReview,
    onAddOrderComment,
    productToEdit,
    onClearEdit,
    onDeleteUsers
}) => {
    const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'reviews' | 'reports'>('products');

    // Product Edit State
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Sync from parent
    useEffect(() => {
        if (productToEdit) {
            setActiveTab('products');
            setEditingProduct(productToEdit);
        }
    }, [productToEdit]);

    // Order Logic
    const [orderSearch, setOrderSearch] = useState('');

    // Review Logic
    const [replyText, setReplyText] = useState<Record<number, string>>({});

    const assemblers = users.filter(u => u.role === UserRole.assembler);

    // --- Product Handlers ---
    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            onUpdateProduct(editingProduct);
            setEditingProduct(null);
            onClearEdit();
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        onClearEdit();
    };

    // --- Order Handlers ---
    const handleAssignAssembler = (order: Order, assemblerId: number) => {
        onUpdateOrder({ ...order, assemblerId });
    };

    const handleUpdateOrderPrice = (order: Order, newTotal: number) => {
        onUpdateOrder({ ...order, total_amount: newTotal });
    };

    // --- Review Handlers ---
    const handleSubmitReply = (reviewId: number) => {
        if (replyText[reviewId]) {
            onReplyReview(reviewId, replyText[reviewId]);
            setReplyText(prev => ({ ...prev, [reviewId]: '' }));
        }
    };

    // --- Reports Handlers ---
    const handleExportCSV = () => {
        const headers = ['ID заказа', 'Клиент', 'Телефон', 'Статус', 'Сумма', 'Дата'];
        const rows = orders.map(o => [
            o.id,
            o.customer_name,
            o.customer_phone,
            STATUS_TRANSLATIONS[o.status] || o.status,
            o.total_amount,
            o.created_at
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "manager_orders_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ orders }, null, 2));
        const link = document.createElement("a");
        link.setAttribute("href", dataStr);
        link.setAttribute("download", "orders_backup.json");
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
            printWindow.document.write('<h1>Отчет по заказам ()</h1>');
            printWindow.document.write('<table><thead><tr><th>ID</th><th>Клиент</th><th>Статус</th><th>Сумма</th><th>Дата</th></tr></thead><tbody>');

            orders.forEach(o => {
                printWindow.document.write(`<tr><td>${o.id}</td><td>${o.customer_name}</td><td>${STATUS_TRANSLATIONS[o.status] || o.status}</td><td>${o.total_amount} ₽</td><td>${o.created_at}</td></tr>`);
            });

            printWindow.document.write('</tbody></table>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    // --- Renderers ---

    const renderProducts = () => {
        if (editingProduct) {
            return (
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold mb-4">Редактирование: {editingProduct.name}</h3>
                    <form onSubmit={handleSaveProduct} className="space-y-4 max-w-2xl">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Название</label>
                            <input
                                type="text"
                                value={editingProduct.name}
                                onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded p-2 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Цена (₽)</label>
                                <input
                                    type="number"
                                    value={editingProduct.base_price}
                                    onChange={e => setEditingProduct({ ...editingProduct, base_price: Number(e.target.value) })}
                                    className="w-full bg-white border border-slate-300 rounded p-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Скидка (%)</label>
                                <input
                                    type="number"
                                    value={editingProduct.discount || 0}
                                    onChange={e => setEditingProduct({ ...editingProduct, discount: Number(e.target.value) })}
                                    className="w-full bg-white border border-slate-300 rounded p-2 text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">Ссылка на изображение</label>
                            <input
                                type="text"
                                value={editingProduct.image_url || ''}
                                onChange={e => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded p-2 text-sm"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={editingProduct.isSale || false}
                                onChange={e => setEditingProduct({ ...editingProduct, isSale: e.target.checked })}
                                className="rounded bg-white border-slate-300"
                            />
                            <label className="text-sm">Пометить как "Распродажа"</label>
                        </div>
                        <div className="flex gap-2 pt-4">
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Сохранить</button>
                            <button type="button" onClick={handleCancelEdit} className="bg-slate-200 text-slate-700 px-4 py-2 rounded text-sm hover:bg-slate-300">Отмена</button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
                <div className="space-y-4">
                    {products.map(product => (
                        <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 gap-4">
                            <div className="flex items-center space-x-4">
                                <img src={product.image_url} alt="" className="w-12 h-12 rounded object-cover" />
                                <div>
                                    <h4 className="font-semibold text-slate-800">{product.name}</h4>
                                    <div className="text-xs text-slate-500">
                                        {product.base_price} ₽ {product.discount ? `(-${product.discount}%)` : ''}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingProduct(product)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm self-end sm:self-auto"
                            >
                                <i className="fa-solid fa-pen mr-1"></i> Редактировать
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderOrders = () => {
        const filteredOrders = orders.filter(o =>
            o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) ||
            o.id.toString().includes(orderSearch)
        );

        return (
            <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
                <div className="mb-4">
                    <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Поиск по номеру или клиенту..."
                        className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm"
                    />
                </div>
                <div className="space-y-6">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-slate-200">
                                <div>
                                    <div className="font-mono text-lg font-bold text-slate-700">#{order.id}</div>
                                    <div className="text-sm font-bold mt-1">{order.customer_name}</div>
                                    <div className="text-xs text-slate-500">{order.customer_phone}</div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-2 mb-2">
                                        <span className="text-sm text-slate-500">Итого:</span>
                                        <input
                                            type="number"
                                            value={order.total_amount}
                                            onChange={(e) => handleUpdateOrderPrice(order, Number(e.target.value))}
                                            className="w-24 bg-white border border-slate-300 rounded px-2 py-1 text-right font-bold text-lg"
                                        />
                                        <span className="font-bold text-lg">₽</span>
                                    </div>
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="text-sm text-slate-600">Сборщик:</span>
                                        <select
                                            value={order.assemblerId || ''}
                                            onChange={(e) => handleAssignAssembler(order, Number(e.target.value))}
                                            className="bg-white border border-slate-300 rounded px-2 py-1 text-sm max-w-[140px]"
                                        >
                                            <option value="">Не назначен</option>
                                            {assemblers.map(a => (
                                                <option key={a.id} value={a.id}>{a.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mt-2 text-xs">
                                        Статус сборщика: <span className={`font-bold ${order.acceptanceStatus === 'Accepted' ? 'text-green-600' :
                                            order.acceptanceStatus === 'Rejected' ? 'text-red-600' : 'text-slate-400'
                                            }`}>
                                            {ACCEPTANCE_TRANSLATIONS[order.acceptanceStatus || 'Pending']}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Simplified comment view for manager context */}
                            <div className="mt-2">
                                <button
                                    className="text-xs text-blue-600 hover:underline"
                                    onClick={() => onAddOrderComment(order.id, "Заказ проверен Админом.", true, "Админ")}
                                >
                                    + Добавить пометку "Проверен"
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderReviews = () => {
        return (
            <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50 relative group">
                            <button
                                onClick={() => onDeleteReview(review.id)}
                                className="absolute top-2 right-2 text-red-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Удалить отзыв"
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>

                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-slate-800">{review.authorName}</span>
                                <div className="flex text-yellow-400 text-xs">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className={`fa-solid fa-star ${i < review.rating ? '' : 'text-slate-200'}`}></i>
                                    ))}
                                </div>
                                <span className="text-xs text-slate-400 ml-auto">{review.created_at}</span>
                            </div>
                            <p className="text-sm text-slate-700 mb-3">{review.text}</p>

                            {review.reply ? (
                                <div className="ml-4 bg-blue-50 p-3 rounded text-sm text-slate-700 border-l-2 border-blue-400">
                                    <span className="font-bold text-blue-800 block text-xs mb-1">Ответ магазина:</span>
                                    {review.reply}
                                </div>
                            ) : (
                                <div className="flex gap-2 mt-2">
                                    <textarea
                                        value={replyText[review.id] || ''}
                                        onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                                        className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                                        placeholder="Написать ответ..."
                                        rows={1}
                                    />
                                    <button
                                        onClick={() => handleSubmitReply(review.id)}
                                        className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700"
                                    >
                                        Ответить
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderReportsTab = () => (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-6">Отчеты и Экспорт</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-lg p-5 hover:bg-slate-50 transition-colors">
                    <div className="text-3xl text-green-600 mb-3"><i className="fa-solid fa-file-csv"></i></div>
                    <h3 className="font-bold text-lg mb-2">Экспорт CSV</h3>
                    <p className="text-sm text-slate-500 mb-4">Скачать данные о заказах в формате CSV для Excel.</p>
                    <button onClick={handleExportCSV} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">Скачать CSV</button>
                </div>

                <div className="border border-slate-200 rounded-lg p-5 hover:bg-slate-50 transition-colors">
                    <div className="text-3xl text-blue-600 mb-3"><i className="fa-solid fa-file-code"></i></div>
                    <h3 className="font-bold text-lg mb-2">Резервная копия JSON</h3>
                    <p className="text-sm text-slate-500 mb-4">Данные о заказах в формате JSON.</p>
                    <button onClick={handleExportJSON} className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">Скачать JSON</button>
                </div>

                <div className="border border-slate-200 rounded-lg p-5 hover:bg-slate-50 transition-colors">
                    <div className="text-3xl text-red-600 mb-3"><i className="fa-solid fa-print"></i></div>
                    <h3 className="font-bold text-lg mb-2">Печать отчета</h3>
                    <p className="text-sm text-slate-500 mb-4">Версия для печати или сохранения в PDF.</p>
                    <button onClick={handlePrintPDF} className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">Печать (PDF)</button>
                </div>
            </div>
        </div>
    );


    const renderUsersTab = () => (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-6">Пользователи</h2>

            <div className="space-y-4">
                {users.map(user => (
                    <div key={user.id} className="relative group border border-slate-100 rounded-lg p-4 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <span className="font-semibold text-slate-800">
                                Имя пользователя:<br />{user.name}
                            </span>

                            <span className="text-sm text-slate-500">
                                Email пользователя:<br />{user.email}
                            </span>
                        </div>
                        <span className="text-sm text-slate-600">
                            Роль пользователя:<br />{user.role}
                        </span>
                        <button
                            onClick={() => onDeleteUsers(user.id)}
                            className="absolute top-2 right-2 text-red-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Удалить пользователя"
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <i className="fa-solid fa-briefcase text-purple-600 mr-3"></i>
                Кабинет Админа
            </h1>

            <div className="flex flex-wrap gap-1 bg-slate-200 p-1 rounded-lg mb-6 w-full md:w-fit">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    Товары
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    Заказы
                </button>
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'reviews' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    Отзывы
                </button>
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    Отчеты
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'reports' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                    Пользователи
                </button>
            </div>


            {activeTab === 'products' && renderProducts()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'reviews' && renderReviews()}
            {activeTab === 'reports' && renderReportsTab()}
            {activeTab === 'users' && renderUsersTab()}
        </div>
    );
};
