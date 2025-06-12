import express from 'express';
import { ProductService } from './services/productService';
import { CartService } from './services/cartService';
import { PaymentService } from './services/paymentService';
import { ShippingService } from './services/shippingService';
import { OrderService } from './services/orderService';
import { ProductController } from './controllers/productController';
import { CartController } from './controllers/cartController';
import { OrderController } from './controllers/orderController';

const app = express();
app.use(express.json());

const productService = new ProductService();
const cartService = new CartService();
const paymentService = new PaymentService();
const shippingService = new ShippingService();
const orderService = new OrderService(cartService, paymentService, shippingService, productService);
const productController = new ProductController(productService);
const cartController = new CartController(cartService);
const orderController = new OrderController(orderService);

app.locals.cartService = cartService;

app.get('/products', productController.getProducts);
app.post('/cart/items', cartController.addItem);
app.get('/cart', cartController.getCart);
app.post('/orders', orderController.createOrder);

export default app;

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}
