import { Product } from '../models/product';

export class ProductService {
  constructor(private apiUrl: string = 'http://localhost:3001') {}

  async getAll(): Promise<Product[]> {
    return this.fetchAll();
  }

  async fetchAll(): Promise<Product[]> {
    try {
      const res = await fetch(`${this.apiUrl}/products`);
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      return res.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async findById(id: string): Promise<Product | undefined> {
    try {
      const products = await this.fetchAll();
      return products.find(p => p.id === id);
    } catch (error) {
      console.error(`Error finding product with id ${id}:`, error);
      return undefined;
    }
  }
}
