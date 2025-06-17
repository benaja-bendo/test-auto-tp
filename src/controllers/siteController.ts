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

  cartPage = (_req: Request, res: Response): void => {
    res.sendFile(path.join(viewsDir, 'cart.html'));
  };

  checkout = async (req: Request, res: Response): Promise<void> => {
    const { shippingMethod } = req.body as any;
    const order = await this.orderService.createOrder(shippingMethod);
    
    // Rediriger vers une page de confirmation de commande
    res.send(`
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Commande Confirmée</title>
          <link rel="stylesheet" href="/main.css" />
        </head>
        <body>
          <div id="header-container"></div>
          
          <main class="container">
            <h1>Commande Confirmée</h1>
            <div class="order-confirmation">
              <p>Votre commande <strong>${order.id}</strong> a été confirmée.</p>
              <p>Statut: <span class="order-status">${order.status}</span></p>
              <p>Total: ${order.total.toFixed(2)} €</p>
              <p>Frais de livraison: ${order.shippingCost.toFixed(2)} €</p>
              <p>Méthode de livraison: ${order.shippingMethod}</p>
            </div>
            <div class="order-actions">
              <a href="/" class="button">Retour à la boutique</a>
            </div>
          </main>
          
          <script src="/cart.js"></script>
          <script>
            // Charger l'en-tête
            fetch('/views/partials/header.html')
              .then(response => response.text())
              .then(html => {
                document.getElementById('header-container').innerHTML = html;
                // Vider le panier après la commande
                if (window.cartManager) {
                  cartManager.clearCart();
                }
              });
          </script>
        </body>
      </html>
    `);
  };
  
  // Méthode pour servir les fichiers partiels
  servePartial = (req: Request, res: Response): void => {
    const partialName = req.params.name;
    // Vérifier si le nom du fichier contient déjà l'extension .html
    const fileName = partialName.endsWith('.html') ? partialName : `${partialName}.html`;
    res.sendFile(path.join(viewsDir, 'partials', fileName));
  };
}
