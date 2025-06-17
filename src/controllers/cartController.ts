import { Request, Response } from 'express';
import { CartService } from '../services/cartService';
import { ProductService } from '../services/productService';

export class CartController {
  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {}

  addItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId, quantity } = req.body as any;
      const qty = Number(quantity) || 1;
      const product = await this.productService.findById(productId);
      
      if (!product) {
        res.status(400).json({ error: 'Produit non trouvé' });
        return;
      }

      this.cartService.addItem(productId, qty);
      const items = await Promise.all(
        this.cartService.getItems().map(async (item) => {
          const product = await this.productService.findById(item.productId);
          return {
            ...item,
            product
          };
        })
      );

      if (req.is('application/json')) {
        res.status(201).json(items);
      } else {
        res.redirect('/cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout au panier' });
    }
  };

  updateItem = (req: Request, res: Response): void => {
    const { productId, quantity } = req.body as any;
    const qty = Number(quantity) || 1;
    
    // Si la quantité est 0, supprimer l'élément
    if (qty <= 0) {
      this.cartService.removeItem(productId);
    } else {
      this.cartService.updateItem(productId, qty);
    }
    
    res.status(200).json({ success: true });
  };

  removeItem = (req: Request, res: Response): void => {
    const { productId } = req.params;
    this.cartService.removeItem(productId);
    res.status(200).json({ success: true });
  };

  clearCart = (req: Request, res: Response): void => {
    this.cartService.clear();
    res.status(200).json({ success: true });
  };

  getItems = async (req: Request, res: Response): Promise<void> => {
    try {
      const items = this.cartService.getItems();
      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          const product = await this.productService.findById(item.productId);
          return {
            ...item,
            product
          };
        })
      );
      res.json(itemsWithProducts);
    } catch (error) {
      console.error('Error getting cart items:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du panier' });
    }
  };

  emptyCart = (req: Request, res: Response): void => {
    this.cartService.clear();
    res.status(204).end();
  };
}
