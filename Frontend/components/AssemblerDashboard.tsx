
import React, { useState } from 'react';
import { Order } from '../types';
import { STATUS_TRANSLATIONS, ACCEPTANCE_TRANSLATIONS } from '../constants';

interface AssemblerDashboardProps {
    orders: Order[];
    currentUserId?: number;
    onUpdateStatus?: (orderId: number, status: 'Completed' | 'Processing') => void;
    onUpdateOrder?: (order: Order) => void;
    onAddOrderComment?: (orderId: number, text: string, isInternal: boolean, author: string) => void;
    onUpdateOrderStatus?: (orderId: number, status: string) => void;
}

export const AssemblerDashboard: React.FC<AssemblerDashboardProps> = ({ 
    orders, 
    currentUserId,
    onUpdateStatus,
    onUpdateOrder,
    onAddOrderComment,
    onUpdateOrderStatus
}) => {
    const [editingOrderId, setEditingOrderId] = useState<number | null>(null);
    const [commentText, setCommentText] = useState('');
    const [commentType, setCommentType] = useState<'internal' | 'public'>('internal');

    const myOrders = orders.filter(o => (o as any).assemblerId === currentUserId && o.status !== 'Cancelled');

    const handleAddComment = (orderId: number) => {
        if (!commentText.trim()) return;
        onAddOrderComment?.(orderId, commentText, commentType === 'internal', "Сборщик");
        setCommentText('');
    };

    const handleUpdateQuantity = (order: Order, itemId: number, delta: number) => {
         const updatedItems = order.items.map(item => {
            if (item.id === itemId) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0);
        // Recalculate basic total
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.base_price * item.quantity), 0);
        onUpdateOrder({ ...order, items: updatedItems, totalAmount: newTotal });
    };

    const handleAcceptance = (order: Order, status: 'Accepted' | 'Rejected') => {
        onUpdateOrder({ ...order, acceptanceStatus: status });
    };

    const handleDateChange = (order: Order, date: string) => {
        onUpdateOrder({ ...order, estimatedCompletionDate: date });
    };

    const handlePrintAssemblySheet = (order: Order) => {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Лист сборки</title>');
            printWindow.document.write(`
                <style>
                    body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
                    .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
                    .header .meta { text-align: right; font-size: 14px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; font-size: 14px; }
                    .info-box { background: #f9f9f9; padding: 15px; border: 1px solid #eee; border-radius: 4px; }
                    .info-box h3 { margin-top: 0; margin-bottom: 10px; font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                    .info-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
                    .info-label { font-weight: bold; color: #666; }
                    
                    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; }
                    th { background-color: #f0f0f0; border: 1px solid #ccc; padding: 10px; text-align: left; font-weight: bold; }
                    td { border: 1px solid #ccc; padding: 10px; vertical-align: top; }
                    tr:nth-child(even) { background-color: #fcfcfc; }
                    
                    .comments { margin-bottom: 30px; border: 1px solid #ccc; padding: 15px; font-size: 14px; }
                    .comments h3 { margin-top: 0; font-size: 16px; margin-bottom: 10px; }
                    .comment-item { margin-bottom: 5px; border-bottom: 1px dashed #eee; padding-bottom: 5px; }
                    
                    .footer { margin-top: 50px; display: flex; justify-content: space-between; font-size: 14px; page-break-inside: avoid; }
                    .sign-box { width: 45%; border-top: 1px solid #000; padding-top: 10px; }
                    
                    @media print {
                        body { padding: 0; }
                        button { display: none; }
                    }
                </style>
            `);
            printWindow.document.write('</head><body>');
            
            printWindow.document.write(`
                <div class="header">
                    <div>
                        <h1>Лист сборки</h1>
                        <div style="font-size: 18px; margin-top: 5px;">Заказ №${order.id}</div>
                    </div>
                    <div class="meta">
                        <div>Дата создания: ${order.created_at}</div>
                        <div>Статус: ${STATUS_TRANSLATIONS[order.status] || order.status}</div>
                    </div>
                </div>

                <div class="info-grid">
                    <div class="info-box">
                        <h3>Информация о клиенте</h3>
                        <div class="info-row"><span class="info-label">ФИО:</span> <span>${order.customer_name}</span></div>
                        <div class="info-row"><span class="info-label">Телефон:</span> <span>${order.customer_phone}</span></div>
                    </div>
                    <div class="info-box">
                        <h3>Детали производства</h3>
                        <div class="info-row"><span class="info-label">Всего позиций:</span> <span>${order.items.reduce((acc, item) => acc + item.quantity, 0)}</span></div>
                    </div>
                </div>

                <h3>Спецификация заказа</h3>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%">№</th>
                            <th style="width: 35%">Наименование / Артикул</th>
                            <th style="width: 25%">Характеристики</th>
                            <th style="width: 15%">Размеры</th>
                            <th style="width: 10%">Кол-во</th>
                            <th style="width: 10%">Отметка</th>
                        </tr>
                    </thead>
                    <tbody>
            `);

            printWindow.document.write(`
                    </tbody>
                </table>
            `);

            if (order.comments && order.comments.length > 0) {
                 printWindow.document.write(`
                    <div class="comments">
                        <h3>Комментарии и примечания</h3>
                        ${order.comments.map(c => `
                            <div class="comment-item">
                                <strong>${c.author} (${c.created_at}):</strong> ${c.text}
                            </div>
                        `).join('')}
                    </div>
                `);
            } else {
                 printWindow.document.write(`
                    <div class="comments" style="color: #999; font-style: italic;">
                        Нет комментариев к заказу.
                    </div>
                `);
            }

            printWindow.document.write(`
                <div class="footer">
                    <div class="sign-box">
                        Сборщик: <br/><br/>
                        ________________________ / ________________
                    </div>
                    <div class="sign-box">
                        Контроль качества (ОТК): <br/><br/>
                        ________________________ / ________________
                    </div>
                </div>
                <div style="margin-top: 20px; font-size: 10px; color: #999; text-align: center;">
                    Документ сгенерирован системой "НовыеОкна" ${new Date().toLocaleString('ru-RU')}
                </div>
            `);

            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    console.log(orders);    
    console.log(orders.items);

return (
    <div className="space-y-4">
    {(orders || []).map(order => (
        <div key={order.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="flex justify-between mb-4">
                <div>
                    <div className="font-mono text-lg font-bold text-slate-700">Заказ #{order.id}</div>
                    <div className="text-xs text-slate-500">{order.created_at}</div>
                    <div className="text-sm font-medium mt-1">{order.customer_name}</div>
                </div>
                <div className="text-xs text-slate-500">Статус: {order.status}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded border border-slate-200 p-3">
                    <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Состав заказа</div>
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                        {(order.items || []).map(item => (
                            <div>
                                <li key={item.id} className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium text-slate-700">{item.name}</div>
                                    </div>
                                </li>
                            </div>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded border border-slate-200 p-3 flex flex-col">
                    <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Чат по заказу</div>
                    <div className="flex-1 overflow-y-auto max-h-32 space-y-2 mb-2">
                        {(order.comments || []).map(c => (
                            <div key={c.id} className={`p-1.5 rounded text-[10px] ${c.isInternal ? 'bg-yellow-50 text-slate-700' : 'bg-blue-50 text-blue-900'}`}>
                                <span className="font-bold mr-1">{c.author}:</span>
                                {c.text}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-1">
                        <input
                            value=""
                            readOnly
                            className="flex-1 bg-white border border-slate-300 rounded text-xs px-2 py-1"
                            placeholder="Комментарий..."
                        />
                        <select className="bg-white border border-slate-300 rounded px-1 py-1 text-[10px]" disabled>
                            <option>Внутр.</option>
                            <option>Клиенту</option>
                        </select>
                        <button className="bg-blue-500 text-white px-2 rounded cursor-not-allowed">
                            <i className="fa-solid fa-paper-plane text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium">
                    <i className="fa-solid fa-print mr-2"></i>Лист сборки
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium cursor-not-allowed">
                    <i className="fa-solid fa-check mr-2"></i>Готово к отгрузке
                </button>
            </div>
        </div>
    ))}
</div>
);
};
