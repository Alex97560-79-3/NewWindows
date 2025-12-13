import React from 'react';
import { Order } from '../types';

interface OrdersViewProps {
  orders: Order[];
  isLoading?: boolean;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, isLoading }) => {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; icon: string }> = {
      'pending': { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: 'fa-clock' },
      'confirmed': { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'fa-check-circle' },
      'in_progress': { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'fa-spinner' },
      'completed': { bg: 'bg-green-50', text: 'text-green-700', icon: 'fa-check' },
      'cancelled': { bg: 'bg-red-50', text: 'text-red-700', icon: 'fa-xmark' },
    };
    const config = statusMap[status] || statusMap['pending'];
    const labelMap: Record<string, string> = {
      'pending': 'Ожидает',
      'confirmed': 'Подтвержден',
      'in_progress': 'В работе',
      'completed': 'Завершен',
      'cancelled': 'Отменен',
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <i className={`fa-solid ${config.icon}`}></i>
        {labelMap[status] || status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p className="text-slate-600">Загрузка заказов...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <i className="fa-solid fa-box-open text-6xl text-slate-200 mb-4"></i>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Заказов нет</h2>
        <p className="text-slate-500">Пока вы не оформили ни одного заказа</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
        <i className="fa-solid fa-box text-blue-600 mr-3"></i>
        Мои заказы ({orders.length})
      </h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-slate-200">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Номер заказа</p>
                <p className="font-bold text-slate-800">#{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Дата</p>
                <p className="font-medium text-slate-700">
                  {new Date(order.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Статус</p>
                <div>{getStatusBadge(order.status)}</div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Сумма</p>
                <p className="font-bold text-lg text-slate-900">{order.total_amount.toFixed(0)} ₽</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold mb-1">ЗАКАЗЧИК</p>
                <p className="font-medium text-slate-800">{order.customer_name}</p>
                <p className="text-sm text-slate-600">{order.customer_phone}</p>
              </div>

              {order.items && order.items.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-2">ТОВАРЫ ({order.items.length})</p>
                  <div className="space-y-1 text-sm">
                    {order.items.slice(0, 2).map((item: any, idx: number) => (
                      <p key={idx} className="text-slate-700">
                        {item.name} x{item.quantity}
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-slate-500 italic">+{order.items.length - 2} еще</p>
                    )}
                  </div>
                </div>
              )}

              {order.comments && order.comments.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 font-semibold mb-1">КОММЕНТАРИИ</p>
                  <p className="text-sm text-slate-700 line-clamp-3">{order.comments[0]?.text}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
