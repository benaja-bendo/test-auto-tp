import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { CartController } from '../controllers/cartController';
import { SiteController } from '../controllers/siteController';
import { OrderController } from '../controllers/orderController';
import { ShippingController } from '../controllers/shippingController';
import { PaymentController } from '../controllers/paymentController';
import { CustomerController } from '../controllers/customerController';

export class Routes {
  constructor(
    private siteController: SiteController,
    private productController: ProductController,
    private cartController: CartController,
    private orderController: OrderController,
    private shippingController: ShippingController,
    private paymentController: PaymentController,
    private customerController: CustomerController
  ) {}

  public init(): Router {
    const router = Router();

    // Site routes
    router.get('/', this.siteController.home);
    router.get('/product/:id', this.siteController.productPage);
    router.get('/cart', this.siteController.cartPage);
    router.get('/checkout', this.siteController.checkout);
    router.get('/order-confirmation/:orderId', this.siteController.orderConfirmation);
    router.get('/views/partials/:name', this.siteController.servePartial);

    // API routes
    router.get('/api/products', this.productController.getAll);
    router.get('/api/products/:id', this.productController.getById);
    router.patch('/api/products/:id', this.productController.updateProduct);

    // Carriers routes
    router.get('/api/carriers', this.shippingController.getAllCarriers);
    router.get('/api/carriers/:id', this.shippingController.getCarrierById);

    // Payments routes
    router.get('/api/payments', this.paymentController.getAllPayments);
    router.get('/api/payments/:id', this.paymentController.getPaymentById);

    // Cart routes
    router.get('/api/cart/items', this.cartController.getItems);
    router.post('/api/cart/items', this.cartController.addItem);
    router.put('/api/cart/items', this.cartController.updateItem);
    router.delete('/api/cart/items/:productId', this.cartController.removeItem);
    router.post('/api/cart/clear', this.cartController.clearCart);

    // Customer routes
    router.post('/api/customers', this.customerController.createCustomer.bind(this.customerController));
    router.post('/api/customers/:customerId/addresses', this.customerController.addAddress.bind(this.customerController));
    router.get('/api/customers/:customerId/addresses', this.customerController.getCustomerAddresses.bind(this.customerController));
    
    // Order routes
    router.post('/api/orders', this.orderController.createOrder.bind(this.orderController));
    router.get('/api/customers/:customerId/orders', this.orderController.getCustomerOrders.bind(this.orderController));
    router.get('/api/orders/:orderId', this.orderController.getOrderDetails.bind(this.orderController));

    return router;
  }
}
