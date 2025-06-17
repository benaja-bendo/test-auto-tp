import { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProductService } from '../services/productService';
import { CartService } from '../services/cartService';
import { OrderService } from '../services/orderService';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viewsDir = path.join(__dirname, '../views');

export class SiteController {
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  home = (_req: Request, res: Response): void => {
    res.sendFile(path.join(viewsDir, 'index.html'));
  };

  productPage = (_req: Request, res: Response): void => {
    res.sendFile(path.join(viewsDir, 'product.html'));
  };

  cartPage = async (req: Request, res: Response): Promise<void> => {
    const items = this.cartService.getItems();
    let rows = '';
    
    // Traiter les éléments du panier de manière asynchrone
    for (const item of items) {
      const product = await this.productService.findById(item.productId);
      const name = product?.name ?? item.productId;
      rows += `<li>${name} x ${item.quantity}</li>`;
    }
    
    res.send(
      `<h1>Cart</h1><ul>${rows}</ul>` +
        `<form method="post" action="/checkout">` +
        `<select name="shippingMethod">` +
        `<option value="standard">Standard</option>` +
        `<option value="express">Express</option>` +
        `</select>` +
        `<button type="submit">Checkout</button>` +
        `</form>`
    );
  };

  checkout = async (req: Request, res: Response): Promise<void> => {
    const { shippingMethod } = req.body as any;
    const order = await this.orderService.createOrder(shippingMethod);
    res.send(`<h1>Order ${order.id}</h1><p>Status: ${order.status}</p>`);
  };
}
