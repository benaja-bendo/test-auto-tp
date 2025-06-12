import { CartService } from '../services/cartService';
declare global {
  namespace Express {
    interface Application {
      locals: {
        cartService: CartService;
      };
    }
  }
}
export {};
