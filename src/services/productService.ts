import { Product } from '../models/product';

const products: Product[] = [
  { id: '1', name: 'Laptop', price: 1000 },
  { id: '2', name: 'Phone', price: 800 }
];

export class ProductService {
  constructor(private apiUrl: string | undefined = process.env.PRODUCT_API_URL) {}

  getAll(): Product[] {
    return products;
  }

  async fetchAll(): Promise<Product[]> {
    if (!this.apiUrl) {
      return Promise.resolve(products);
    }
    const res = await fetch(`${this.apiUrl}/products`);
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    return res.json();
  }

  findById(id: string): Product | undefined {
    return products.find(p => p.id === id);
  }
}
