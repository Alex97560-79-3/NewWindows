
import React from 'react';
import { Product, UserRole } from '../types';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onViewDetails: (product: Product) => void;
    isFavorite: boolean;
    onToggleFavorite: (id: number) => void;
    userRole: UserRole;
    onEdit?: (product: Product) => void;
    onDelete?: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
    product, 
    onAddToCart, 
    onViewDetails,
    isFavorite,
    onToggleFavorite,
    userRole,
    onEdit,
    onDelete
}) => {
    return (
        <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col h-full relative group border border-transparent hover:border-slate-200">
            {/* Top Right Action Button */}
            {[UserRole.ADMIN, UserRole.MANAGER].includes(userRole) ? (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(product.id);
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors shadow-sm"
                    title="Удалить товар"
                >
                    <i className="fa-solid fa-trash"></i>
                </button>
            ) : userRole === UserRole.ASSEMBLER ? (
                null
            ) : (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(product.id);
                    }}
                    className={`absolute top-3 right-3 z-10 transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm ${isFavorite ? 'text-red-500' : 'text-slate-300 hover:text-red-400'}`}
                >
                    <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart text-xl`}></i>
                </button>
            )}

            {/* Image Area */}
            <div className="relative aspect-[4/5] bg-slate-100 cursor-pointer" onClick={() => onViewDetails(product)}>
                <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute bottom-2 left-2 flex flex-col gap-1 items-start">
                    {product.isSale && (
                        <span className="bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Распродажа
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col flex-grow">
                {/* Price Block */}
                <div className="mb-2">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-red-600">{product.basePrice.toLocaleString('ru-RU')} ₽</span>
                        {product.oldPrice && (
                             <span className="text-xs text-slate-400 line-through">{product.oldPrice.toLocaleString('ru-RU')} ₽</span>
                        )}
                    </div>
                    {product.discount && (
                        <span className="text-xs text-pink-600 font-bold">-{product.discount}%</span>
                    )}
                </div>

                {/* Original Badge */}
                {product.isOriginal && (
                    <div className="flex items-center mb-1.5">
                        <span className="text-[10px] font-bold text-slate-800 bg-green-100 px-1 rounded flex items-center">
                            <i className="fa-solid fa-check text-green-600 mr-1 text-[8px]"></i>
                            Оригинал
                        </span>
                    </div>
                )}

                {/* Title */}
                <h3 
                    className="text-sm text-slate-800 leading-snug line-clamp-2 mb-1 hover:text-blue-600 cursor-pointer"
                    onClick={() => onViewDetails(product)}
                >
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-yellow-400 text-xs">
                        <i className="fa-solid fa-star"></i>
                        <span className="text-slate-900 font-bold ml-1">{product.rating}</span>
                    </div>
                    <span className="text-xs text-slate-400">• {product.reviewCount} отзывов</span>
                </div>

                {/* Action Button */}
                {[UserRole.ADMIN, UserRole.MANAGER].includes(userRole) ? (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(product);
                        }}
                        className="mt-auto w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-pen text-xs"></i> Редактировать
                    </button>
                ) : userRole === UserRole.ASSEMBLER ? (
                     <div className="mt-auto text-center text-xs text-slate-400 py-2 border-t border-slate-100">
                        Товар каталога
                    </div>
                ) : (
                    <button 
                        onClick={() => onAddToCart(product)}
                        className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors"
                    >
                        В корзину
                    </button>
                )}
            </div>
        </div>
    );
};
