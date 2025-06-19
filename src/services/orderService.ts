import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { CartService } from './cartService';
import { PaymentService } from './paymentService';
import { ShippingService } from './shippingService';
import { ProductService } from './productService';

export class OrderService {
  private orderRepository: Repository<Order>;
  private orderItemRepository: Repository<OrderItem>;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private shippingService: ShippingService,
    private productService: ProductService
  ) {
    this.orderRepository = AppDataSource.getRepository(Order);
    this.orderItemRepository = AppDataSource.getRepository(OrderItem);
  }

  getCartItems() {
    return this.cartService.getItems();
  }

  async createOrder(orderData: {
    customerId: number;
    carrierId: string;
    paymentMethod: string;
    shippingAddressId: number;
    billingAddressId: number;
  }): Promise<Order> {
    const items = this.cartService.getItems();
    
    if (items.length === 0) {
      throw new Error('Cannot create order with empty cart');
    }
    
    // Calculer le total des articles de manière asynchrone
    let itemsTotal = 0;
    for (const item of items) {
      const product = await this.productService.findById(item.productId);
      if (product) {
        itemsTotal += product.price * item.quantity;
      }
    }

    const shippingCost = this.shippingService.getCost(orderData.carrierId);
    const total = itemsTotal + shippingCost;

    // Create order in database
    const order = this.orderRepository.create({
      ...orderData,
      shippingCost,
      total,
      status: 'pending'
    });

    const savedOrder = await this.orderRepository.save(order);

    // Create order items
    for (const item of items) {
      const product = await this.productService.findById(item.productId);
      if (!product) continue;

      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });

      await this.orderItemRepository.save(orderItem);
      
      // Mettre à jour le stock du produit
      if (product.stock !== undefined) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await this.productService.updateProduct(item.productId, { stock: newStock });
      }
    }

    // Process payment
    const paymentSuccess = await this.paymentService.processPayment(
      savedOrder.id.toString(),
      savedOrder.total
    );
    
    if (paymentSuccess) {
      savedOrder.status = 'paid';
      await this.orderRepository.save(savedOrder);
      
      // Ship order
      await this.shippingService.shipOrder(savedOrder.id.toString(), orderData.carrierId);
      savedOrder.status = 'shipped';
      await this.orderRepository.save(savedOrder);
    }
    
    // Clear cart
    this.cartService.clear();
    
    return this.getOrderWithItems(savedOrder.id);
  }
  
  async getOrderWithItems(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items']
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  async getCustomerOrders(customerId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerId },
      relations: ['items'],
      order: { createdAt: 'DESC' }
    });
  }
}
