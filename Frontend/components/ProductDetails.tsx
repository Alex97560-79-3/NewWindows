
import React, { useState } from 'react';
import { Product, CartItem, Review, UserRole } from '../types';

interface ProductDetailsProps {
    product: Product;
    reviews: Review[];
    onAddToCart: (product: Product) => void;
    onBack: () => void;
    cartItems: CartItem[];
    userRole: string | UserRole;
    onEdit?: (product: Product) => void;
    onDelete?: (id: number) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
    product, 
    reviews, 
    onAddToCart, 
    onBack, 
    cartItems,
    userRole,
    onEdit,
    onDelete
}) => {
    const [activeImage, setActiveImage] = useState(product.imageUrl);
    
    const images = [
        product.imageUrl,
        `https://picsum.photos/400/400?random=${product.id + 100}`,
        `https://picsum.photos/400/400?random=${product.id + 200}`,
        `https://picsum.photos/400/400?random=${product.id + 300}`,
    ];

    const productReviews = reviews.filter(r => r.productId === product.id);
    const cartItem = cartItems.find(item => item.id === product.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    return (
        <div className="animate-fade-in-up pb-12">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
                <button onClick={onBack} className="hover:text-blue-600 transition-colors">Главная</button>
                <i className="fa-solid fa-chevron-right text-xs mx-2 text-slate-300"></i>
                <button onClick={onBack} className="hover:text-blue-600 transition-colors">Каталог</button>
                <i className="fa-solid fa-chevron-right text-xs mx-2 text-slate-300"></i>
                <span className="text-slate-900 font-medium truncate">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Images (Desktop: Thumbnails + Main) */}
                <div className="lg:col-span-5 flex flex-col md:flex-row gap-4">
                    {/* Main Image */}
                    <div className="flex-1 bg-white rounded-2xl border border-slate-100 p-2 relative group">
                        <img 
                            src={activeImage} 
                            alt={product.name} 
                            className="w-full h-auto rounded-xl object-contain aspect-square"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-slate-200 rounded-xl"><i class="fa-solid fa-image text-slate-400 text-6xl"></i></div>';
                              }
                            }}
                        />
                        {product.isSale && (
                            <span className="absolute top-4 left-4 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded">
                                -{product.discount}%
                            </span>
                        )}
                        {!([UserRole.admin, UserRole.manager, UserRole.assembler].includes(userRole)) && (
                            <button className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors bg-white rounded-full p-2 shadow-sm">
                                <i className="fa-solid fa-heart text-xl"></i>
                            </button>
                        )}
                    </div>
                </div>

                {/* Middle Column: Info */}
                <div className="lg:col-span-4">
                    <div className="flex items-center gap-2 mb-2">
                        {product.isOriginal && (
                            <span className="inline-flex items-center text-[10px] font-bold text-slate-800 bg-green-100 px-1.5 py-0.5 rounded">
                                <i className="fa-solid fa-check text-green-600 mr-1"></i>
                                Оригинал
                            </span>
                        )}
                        <span className="text-xs text-slate-400">Артикул: {100000 + product.id}</span>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-1">
                            <div className="flex text-yellow-400 text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fa-solid fa-star ${i < Math.floor(product.rating) ? '' : 'text-slate-200'}`}></i>
                                ))}
                            </div>
                            <span className="text-sm font-medium text-slate-700 ml-1">{product.rating}</span>
                        </div>
                        <a href="#reviews" className="text-sm text-slate-500 hover:text-blue-600 underline decoration-dotted">
                            {product.reviewCount} оценки
                        </a>
                    </div>

                    {/* Specs Preview */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-sm mb-3">Характеристики:</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                                <span className="text-slate-500">Материал профиля</span>
                                <span className="text-slate-900">{product.frameMaterial}</span>
                            </div>
                            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                                <span className="text-slate-500">Стеклопакет</span>
                                <span className="text-slate-900">{product.glassType}</span>
                            </div>
                            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                                <span className="text-slate-500">Количество камер</span>
                                <span className="text-slate-900">{product.chambersCount}</span>
                            </div>
                            <div className="flex justify-between border-b border-dotted border-slate-300 pb-1">
                                <span className="text-slate-500">Размеры (ШхВ)</span>
                                <span className="text-slate-900">{product.width} x {product.height} мм</span>
                            </div>
                        </div>
                        <button className="text-blue-600 text-sm font-medium mt-3 hover:underline">
                            Все характеристики и описание
                        </button>
                    </div>
                </div>

                {/* Right Column: Buy Box (Moves below on mobile) */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-24">
                        <div className="flex items-end gap-3 mb-4">
                            <span className="text-3xl font-bold text-slate-900">{product.basePrice.toLocaleString()} ₽</span>
                            {product.oldPrice && (
                                <span className="text-sm text-slate-400 line-through mb-1.5">{product.oldPrice.toLocaleString()} ₽</span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2 py-1 rounded">
                                Хорошая цена
                            </span>
                        </div>

                        {[UserRole.admin, UserRole.manager].includes(userRole) ? (
                             <div className="space-y-3 mb-6">
                                <button 
                                    onClick={() => onEdit?.(product)}
                                    className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-pen"></i>
                                    Редактировать товар
                                </button>
                                <button 
                                    onClick={() => onDelete?.(product.id)}
                                    className="w-full bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                    Удалить товар
                                </button>
                            </div>
                        ) : userRole === UserRole.assembler ? (
                            <div className="bg-slate-50 p-4 rounded-xl text-center text-slate-500 text-sm mb-6">
                                Просмотр товара в режиме сборщика
                            </div>
                        ) : (
                            <div className="space-y-3 mb-6">
                                <button 
                                    onClick={() => onAddToCart(product)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-blue-200 shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {quantityInCart > 0 ? (
                                        <>
                                            <i className="fa-solid fa-check"></i>
                                            В корзине ({quantityInCart})
                                        </>
                                    ) : (
                                        'Добавить в корзину'
                                    )}
                                </button>
                                <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-3.5 rounded-xl transition-colors">
                                    Купить сейчас
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div id="reviews" className="mt-16">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Оценки <span className="text-slate-400 text-lg font-normal">{product.reviewCount}</span></h2>
                </div>

                <div className="flex items-center gap-2 mb-6 text-2xl font-bold text-slate-900">
                    {product.rating}
                    <div className="flex text-yellow-400 text-lg">
                        {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fa-solid fa-star ${i < Math.floor(product.rating) ? '' : 'text-slate-200'}`}></i>
                        ))}
                    </div>
                </div>

                {/* Review Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {productReviews.length > 0 ? productReviews.map(review => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                    {review.authorName[0]}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{review.authorName}</div>
                                    <div className="text-xs text-slate-400">{review.createdAt}</div>
                                </div>
                                <div className="ml-auto flex text-yellow-400 text-xs">
                                     {[...Array(5)].map((_, i) => (
                                        <i key={i} className={`fa-solid fa-star ${i < review.rating ? '' : 'text-slate-200'}`}></i>
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-700 leading-relaxed">{review.text}</p>
                            
                            {/* manager Reply Display */}
                            {review.reply && (
                                <div className="mt-4 bg-slate-50 p-4 rounded-lg border-l-4 border-blue-500">
                                    <div className="text-xs font-bold text-blue-600 mb-1">Ответ магазина</div>
                                    <p className="text-sm text-slate-600">{review.reply}</p>
                                </div>
                            )}
                        </div>
                    )) : (
                         <div className="col-span-2 text-center py-10 text-slate-400 bg-slate-50 rounded-xl">
                            Нет отзывов для этого товара. Будьте первым!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
