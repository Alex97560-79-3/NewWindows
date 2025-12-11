
export enum UserRole {
    GUEST = 'GUEST',
    CLIENT = 'CLIENT',
    ADMIN = 'ADMIN',
    ASSEMBLER = 'ASSEMBLER',
    MANAGER = 'MANAGER'
}

export interface User {
    id?: number;
    email: string;
    password?: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface Product {
    id: number;
    categoryId: number;
    name: string;
    description: string;
    basePrice: number;
    oldPrice?: number;
    discount?: number; // Percentage
    width: number;
    height: number;
    frameMaterial: string;
    glassType: string;
    chambersCount: number;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    isOriginal?: boolean;
    isSale?: boolean;
    deliveryTime?: string;
    article?: number;
    questionCount?: number;
}

export interface Review {
    id: number;
    productId: number;
    authorName: string;
    rating: number;
    text: string;
    createdAt: string;
    reply?: string; // Manager's reply
}

export interface CartItem extends Product {
    quantity: number;
}

export interface OrderComment {
    id: number;
    author: string;
    text: string;
    createdAt: string;
    isInternal: boolean;
}

export interface Order {
    id: number;
    customerName: string;
    customerPhone: string;
    status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
    acceptanceStatus?: 'Pending' | 'Accepted' | 'Rejected'; // For Assembler
    estimatedCompletionDate?: string; // Set by Assembler
    assemblerId?: number; // Assigned by Manager
    totalAmount: number;
    createdAt: string;
    items: CartItem[];
    comments: OrderComment[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}