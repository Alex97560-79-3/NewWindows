import React from 'react';
import { Product } from '../types';

interface FavoritesViewProps {
  favoriteIds: number[];
  products: Product[];
  onRemoveFromFavorites: (id: number) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteIds,
  products,
  onRemoveFromFavorites,
  onAddToCart,
  onViewDetails
}) => {
  const favoriteProducts = products.filter(p => favoriteIds.includes(p.id!));

  if (favoriteProducts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center">
        <i className="fa-solid fa-heart text-6xl text-slate-200 mb-4"></i>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Избранное пусто</h2>
        <p className="text-slate-500">Добавляйте товары в избранное, чтобы быстро их найти</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 flex items-center">
        <i className="fa-solid fa-heart text-red-500 mr-3"></i>
        Избранное ({favoriteProducts.length})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteProducts.map(product => {
          const isSale = product.is_sale;
          const basePrice = Number(product.base_price) || 0;
          const discount = Number(product.discount) || 0;
          const price = isSale ? basePrice * (1 - discount / 100) : basePrice;

          return (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-slate-200 flex flex-col">
              {/* Image */}
              <div 
                className="relative h-48 bg-slate-100 cursor-pointer overflow-hidden group"
                onClick={() => onViewDetails(product)}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-slate-200"><i class="fa-solid fa-image text-slate-400 text-4xl"></i></div>';
                    }
                  }}
                />
                {isSale && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromFavorites(product.id!);
                  }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-white transition-all shadow-sm"
                >
                  <i className="fa-solid fa-heart text-lg"></i>
                </button>
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-semibold text-slate-800 line-clamp-2 mb-2 text-sm">{product.name}</h3>
                
                {/* Price */}
                <div className="mb-4 mt-auto">
                  {isSale && (
                    <div className="text-xs text-red-500 line-through mb-1">{basePrice.toFixed(0)} ₽</div>
                  )}
                  <div className="text-lg font-bold text-slate-900">{price.toFixed(0)} ₽</div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onAddToCart(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-shopping-cart"></i>
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
