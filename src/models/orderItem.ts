export interface OrderItem {
  id: number;
  orderId: number;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderItemEntity implements OrderItem {
  id: number;
  orderId: number;
  productId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<OrderItem>) {
    Object.assign(this, data);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}