export enum UserRole {
  admin = "admin",
  manager = "manager",
  client = "client",
  assembler = "assembler"
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password_hash?: string;
  role?: UserRole;
  avatar_url?: string;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

// Продукт с поддержкой обоих форматов полей
export interface Product {
  id?: number;
  name: string;
  description?: string;
  base_price: number; // убираем дубликаты
  image_url?: string;
  category_id?: number;
  category?: string;
  brand?: string;
  is_sale?: boolean;
  discount?: number;
  is_original?: boolean;
  rating?: number;
  review_count?: number;
  delivery_time?: string;
  quantity?: number;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id?: number;
  name?: string;
  image_url?: string;
  quantity: number;
  base_price: number;
}

export interface OrderComment {
  id?: number;
  order_id?: number;
  author?: string;
  text?: string;
  is_internal?: boolean;
  created_at?: string;
}

export interface Order {
  id?: number;
  customer_id?: number;
  customer_name?: string;
  customer_phone?: string;
  status: string;
  total_amount: number;
  items?: OrderItem[];
  comments?: OrderComment[];
  assembler_id?: number;
  assemblerId?: number;
  acceptance_status?: string;
  acceptanceStatus?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Review {
  id?: number;
  product_id?: number;
  author?: string;
  author_name?: string;
  authorName?: string;
  rating?: number;
  text?: string;
  reply?: string;
  created_at?: string;
}

// Утилита для нормализации полей продукта
export function normalizeProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    base_price: p.base_price || p.basePrice || 0,
    image_url: p.image_url || p.imageUrl,
    category_id: p.category_id || p.categoryId,
    category: p.category,
    brand: p.brand,
    is_sale: p.is_sale ?? p.isSale ?? false,
    discount: p.discount || 0,
    is_original: p.is_original ?? p.isOriginal ?? true,
    rating: p.rating || 0,
    review_count: p.review_count || p.reviewCount || 0,
    delivery_time: p.delivery_time || p.deliveryTime,
    quantity: p.quantity || 1,
    created_at: p.created_at,
    updated_at: p.updated_at,
    tags: p.tags || []
  };
}

// Утилита для преобразования в формат API
export function productToAPI(p: Product): any {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    base_price: p.base_price,
    image_url: p.image_url,
    category_id: p.category_id,
    brand: p.brand,
    is_sale: p.is_sale,
    discount: p.discount || 0,
    is_original: p.is_original,
    rating: p.rating,
    review_count: p.review_count,
    delivery_time: p.delivery_time,
    tags: p.tags
  };
}

// Утилита для нормализации заказа
export function normalizeOrder(o: any): Order {
  return {
    id: o.id,
    customer_id: o.customer_id,
    customer_name: o.customer_name,
    customer_phone: o.customer_phone,
    status: o.status || 'Pending',
    total_amount: o.total_amount || 0,
    items: o.items || [],
    comments: o.comments || [],
    assembler_id: o.assembler_id || o.assemblerId,
    acceptance_status: o.acceptance_status || o.acceptanceStatus || 'Pending',
    created_at: o.created_at,
    updated_at: o.updated_at
  };
}

// Утилита для нормализации отзыва
export function normalizeReview(r: any): Review {
  return {
    id: r.id,
    product_id: r.product_id,
    author: r.author || r.author_name || r.authorName,
    rating: r.rating || 0,
    text: r.text,
    reply: r.reply,
    created_at: r.created_at
  };
}