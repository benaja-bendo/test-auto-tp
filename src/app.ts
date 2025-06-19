import 'reflect-metadata';
import express, { Application } from 'express';
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
import { errorHandler } from './middlewares/error.middleware';
import { httpLogger } from './middlewares/logger.middleware';
import logger from './config/logger';
import { CustomerService } from './services/customerService';
import { CustomerController } from './controllers/customerController';
import { AppDataSource } from './config/database';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.initializeDatabase();
    this.initializeServices();
  }
  
  private async initializeDatabase(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.log('Database connection initialized');
    } catch (error) {
      console.error('Error initializing database connection:', error);
      // Ne pas quitter le processus pendant les tests
      if (process.env.NODE_ENV !== 'test') {
        process.exit(1);
      }
    }
  }
  
  private config(): void {
    // Middleware de logging HTTP
    this.app.use(httpLogger);

    // Middlewares de parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  private initializeServices(): void {
    // Initialize services
    const productService = new ProductService();
    const cartService = new CartService(productService); // Injecter ProductService dans CartService
    const shippingService = new ShippingService();
    const paymentService = new PaymentService();
    const customerService = new CustomerService();
    const orderService = new OrderService(
      cartService,
      paymentService,
      shippingService,
      productService
    );

    // Initialize controllers
    const productController = new ProductController(productService);
    const cartController = new CartController(cartService, productService);
    const siteController = new SiteController(
      productService,
      cartService,
      orderService,
      shippingService,
      paymentService
    );
    const orderController = new OrderController(orderService);
    const shippingController = new ShippingController(shippingService);
    const paymentController = new PaymentController(paymentService);
    const customerController = new CustomerController(customerService);

    this.app.locals.cartService = cartService;

    // Initialize routes
    const routes = new Routes(
      siteController,
      productController,
      cartController,
      orderController,
      shippingController,
      paymentController,
      customerController
    );

    // Enregistrer les routes
    this.app.use(routes.init());

    // Middleware de gestion d'erreurs (doit être après les routes)
    this.app.use(errorHandler);

    // Log de démarrage de l'application
    logger.info('Application initialisée avec succès');
  }
}

export default new App().app;
