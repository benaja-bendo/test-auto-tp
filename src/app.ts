import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProductService } from './services/productService';
import { CartService } from './services/cartService';
import { PaymentService } from './services/paymentService';
import { ShippingService } from './services/shippingService';
import { OrderService } from './services/orderService';
import { ProductController } from './controllers/productController';
import { CartController } from './controllers/cartController';
import { OrderController } from './controllers/orderController';
import { ShippingController } from './controllers/shippingController';
import { PaymentController } from './controllers/paymentController';
import { SiteController } from './controllers/siteController';
import { Routes } from './routes/index.route';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

const productService = new ProductService();
const cartService = new CartService();
const paymentService = new PaymentService();
const shippingService = new ShippingService();
const orderService = new OrderService(cartService, paymentService, shippingService, productService);
const productController = new ProductController(productService);
const cartController = new CartController(cartService);
const orderController = new OrderController(orderService);
const shippingController = new ShippingController(shippingService);
const paymentController = new PaymentController(paymentService);
const siteController = new SiteController(productService, cartService, orderService);

app.locals.cartService = cartService;

// Initialiser les routes
const routes = new Routes(
  siteController,
  productController,
  cartController,
  orderController,
  shippingController,
  paymentController
);

// Enregistrer les routes
app.use(routes.init());

export default app;
