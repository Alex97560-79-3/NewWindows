import React from 'react';
import { Product, CartItem } from '../types';

interface CartViewProps {
  cartItems: CartItem[];
  onRemoveFromCart: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onCreateOrder: () => void;
  onCommentChange: (comment: string) => void;
  cartComment: string;
  isLoading?: boolean;
}

export const CartView: React.FC<CartViewProps> = ({
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
  onCreateOrder,
  onCommentChange,
  cartComment,
  isLoading
}) => {
  const total = cartItems.reduce((sum, item) => {
    const basePrice = Number(item.base_price) || 0;
    const discount = Number(item.discount) || 0;
    const price = item.is_sale ? basePrice * (1 - discount / 100) : basePrice;
    return sum + price * (item.quantity || 1);
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <i className="fa-solid fa-shopping-cart text-6xl text-slate-200 mb-4"></i>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Корзина пуста</h2>
        <p className="text-slate-500">Добавьте товары для оформления заказа</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
        <i className="fa-solid fa-shopping-cart text-blue-600 mr-3"></i>
        Корзина ({cartItems.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => {
            const quantity = item.quantity || 1;
            const basePrice = Number(item.base_price) || 0;
            const discount = Number(item.discount) || 0;
            const price = item.is_sale ? basePrice * (1 - discount / 100) : basePrice;
            const itemTotal = price * quantity;

            return (
              <div key={item.id} className="bg-white rounded-lg border border-slate-200 p-4 flex gap-4 hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  <img 
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-slate-200"><i class="fa-solid fa-image text-slate-400 text-xl"></i></div>';
                      }
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 mb-1 truncate">{item.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">Артикул: {100000 + item.id}</p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id!, Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => onUpdateQuantity(item.id!, Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 text-center border border-slate-300 rounded px-2 py-1"
                      min="1"
                    />
                    <button
                      onClick={() => onUpdateQuantity(item.id!, quantity + 1)}
                      className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="flex flex-col items-end gap-4">
                  <div className="text-right">
                    {item.is_sale && (
                      <div className="text-xs text-red-600 line-through">{item.base_price} ₽</div>
                    )}
                    <div className="text-lg font-bold text-slate-800">{price.toFixed(0)} ₽</div>
                    <div className="text-sm text-slate-500">Итого: {itemTotal.toFixed(0)} ₽</div>
                  </div>
                  <button
                    onClick={() => onRemoveFromCart(item.id!)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    <i className="fa-solid fa-trash mr-1"></i>
                    Удалить
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary & Checkout */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Сумма заказа</h2>
          
          <div className="space-y-2 mb-6 pb-6 border-b border-slate-200">
            <div className="flex justify-between text-slate-600">
              <span>Товаров:</span>
              <span className="font-medium">{cartItems.length}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Сумма:</span>
              <span className="font-medium">{total.toFixed(0)} ₽</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Комментарий к заказу</label>
            <textarea
              value={cartComment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Дополнительные пожелания..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              rows={4}
            />
          </div>

          <button
            onClick={onCreateOrder}
            disabled={isLoading || cartItems.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Оформление...
              </>
            ) : (
              <>
                <i className="fa-solid fa-check"></i>
                Оформить заказ
              </>
            )}
          </button>

          <p className="text-xs text-slate-500 text-center mt-3">
            Доставка и оплата рассчитываются отдельно
          </p>
        </div>
      </div>
    </div>
  );
};
