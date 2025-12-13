import React from 'react';
import { Product } from '../types';

interface CatalogViewProps {
  products: Product[];
  selectedCategoryId: number | 'all' | 'windows';
  isSaleOnly: boolean;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (id: number) => void;
  favoriteIds: number[];
  isLoading?: boolean;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  selectedCategoryId,
  isSaleOnly,
  onSelectProduct,
  onAddToCart,
  onToggleFavorite,
  favoriteIds,
  isLoading
}) => {
  // Filter products based on category and sale
  let filteredProducts = products;

  if (selectedCategoryId !== 'all') {
    if (selectedCategoryId === 'windows') {
      // Show all products for windows category
      filteredProducts = filteredProducts;
    } else {
      filteredProducts = filteredProducts.filter(p => p.category_id === selectedCategoryId);
    }
  }

  if (isSaleOnly) {
    filteredProducts = filteredProducts.filter(p => p.is_sale);
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
        <p className="text-slate-600">Загрузка товаров...</p>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-20 text-center">
        <i className="fa-solid fa-inbox text-6xl text-slate-200 mb-4"></i>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Товаров не найдено</h2>
        <p className="text-slate-500">Измените параметры поиска</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Товары 
          {isSaleOnly && ' • Только акции'}
          {selectedCategoryId !== 'all' && selectedCategoryId !== 'windows' && ' • Категория'}
        </h2>
        <p className="text-slate-600">Найдено: {filteredProducts.length} товаров</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const isFavorite = favoriteIds.includes(product.id!);
          const isSale = product.is_sale;
          const basePrice = Number(product.base_price) || 0;
          const discount = Number(product.discount) || 0;
          const price = isSale ? basePrice * (1 - discount / 100) : basePrice;

          return (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow border border-transparent hover:border-slate-200 flex flex-col h-full group"
            >
              {/* Image Container */}
              <div
                className="relative h-56 bg-slate-100 overflow-hidden cursor-pointer group"
                onClick={() => onSelectProduct(product)}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-slate-200"><i class="fa-solid fa-image text-slate-400 text-4xl"></i></div>';
                    }
                  }}
                />

                {/* Discount Badge */}
                {isSale && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                )}

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(product.id!);
                  }}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-slate-400 hover:text-red-500 hover:bg-white'
                  }`}
                >
                  <i className={`fa-${isFavorite ? 'solid' : 'regular'} fa-heart text-lg`}></i>
                </button>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                {/* Name */}
                <h3 className="font-semibold text-slate-800 text-sm mb-2 line-clamp-2 h-10">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3 text-xs">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fa-solid fa-star ${i < Math.floor(product.rating || 0) ? '' : 'text-slate-200'}`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-slate-600">({product.review_count || 0})</span>
                </div>

                {/* Price */}
                <div className="mb-4 mt-auto">
                  {isSale && (
                    <div className="text-xs text-slate-400 line-through mb-1">{basePrice.toFixed(0)} ₽</div>
                  )}
                  <div className="text-lg font-bold text-slate-900">{price.toFixed(0)} ₽</div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <i className="fa-solid fa-shopping-cart"></i>
                  В корзину
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
