export interface User {
  id?: number;
  name: string;
  email: string;
  password_hash?: string;
  role?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Product {
  id?: number;
  name: string;
  description?: string;
  base_price: number;
  image_url?: string;
  category?: string;
  brand?: string;
  is_sale?: boolean;
  delivery_time?: string;
  quantity?: number;
  created_at?: string;
  updated_at?: string;
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
  status?: string;
  total_amount?: number;
  items?: OrderItem[];
  comments?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface OrderComment {
  id: number;
  order_id: number;
  author: string;
  text: string;
  is_internal: boolean;
  created_at: string;
}


export interface Review {
  id?: number;
  product_id: number;
  author?: string;
  rating?: number;
  text?: string;
  reply?: string;
  created_at?: string;
}
