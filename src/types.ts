export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'customer' | 'staff';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  categoryName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  categoryId: string;
  productName: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  images?: string[]; // Multiple images for catalog detail gallery
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export type PaymentStatus = 'Pending' | 'Paid';
export type OrderStatus = 'Pending Payment' | 'Processing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

export interface RealTimeNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  orderId?: string;
  createdAt: string;
}
