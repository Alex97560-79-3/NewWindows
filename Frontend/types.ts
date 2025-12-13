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

export interface Product {
  id?: number;
  name: string;
  description?: string;
  base_price: number;
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

export interface Order {
  id?: number;
  customer_id?: number;
  customer_name?: string;
  customer_phone?: string;
  status: string;
  total_amount: number;
  items?: OrderItem[];
  comments?: OrderComment[];
  created_at?: string;
  updated_at?: string;
}

export interface OrderComment {
  id?: number;
  order_id?: number;
  author?: string;
  text?: string;
  is_internal?: boolean;
  created_at?: string;
}

export interface Review {
  id?: number;
  product_id?: number;
  author?: string;
  rating?: number;
  text?: string;
  reply?: string;
  created_at?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  ASSEMBLER = 'assembler',
  CLIENT = 'client',
  GUEST = 'guest'
}
