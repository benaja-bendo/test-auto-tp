import { Router, Express } from 'express';
import { ProductController } from '../controllers/productController';
import { CartController } from '../controllers/cartController';
import { OrderController } from '../controllers/orderController';
import { ShippingController } from '../controllers/shippingController';
import { SiteController } from '../controllers/siteController';

export function registerRoutes(app: Express,
  controllers: {
    product: ProductController;
    cart: CartController;
    order: OrderController;
    shipping: ShippingController;
    site: SiteController;
  }) {
  const api = Router();
  api.get('/products', controllers.product.getProducts);
  api.get('/products/:id', controllers.product.getProduct);
  api.post('/cart/items', controllers.cart.addItem);
  api.get('/cart', controllers.cart.getCart);
  api.delete('/cart', controllers.cart.clearCart);
  api.post('/orders', controllers.order.createOrder);
  api.get('/shipping', controllers.shipping.getOptions);
  app.use('/api', api);

  app.get('/', controllers.site.home);
  app.get('/products/:id', controllers.site.productPage);
  app.get('/cart', controllers.site.cartPage);
  app.post('/checkout', controllers.site.checkout);
}
