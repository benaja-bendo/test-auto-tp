import { Product } from '../models/product';

const products: Product[] = [
  { id: '1', name: 'Laptop', price: 1000 },
  { id: '2', name: 'Phone', price: 800 }
];

export class ProductService {
  getAll(): Product[] {
    return products;
  }

  findById(id: string): Product | undefined {
    return products.find(p => p.id === id);
  }
}
