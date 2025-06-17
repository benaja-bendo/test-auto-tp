import { Product } from '../models/product';
import { env } from '../config/env';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export class ProductService {
  constructor(private apiUrl: string = env.PRODUCT_API_URL || 'http://localhost:3001') {}

  private async readLocalProducts(): Promise<Product[]> {
    try {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const dataPath = path.join(__dirname, '../../jsonserver/data.json');
      const raw = await fs.readFile(dataPath, 'utf-8');
      const json = JSON.parse(raw);
      return json.products || [];
    } catch (error) {
      console.error('Error reading local products:', error);
      return [];
    }
  }

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
      return this.readLocalProducts();
    }
  }

  async findById(id: string): Promise<Product | undefined> {
    try {
      const res = await fetch(`${this.apiUrl}/products/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          return undefined;
        }
        throw new Error(`Failed to fetch product with id ${id}`);
      }
      return res.json();
    } catch (error) {
      console.error(`Error finding product with id ${id}:`, error);
      const products = await this.readLocalProducts();
      return products.find(p => p.id === id);
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    try {
      const res = await fetch(`${this.apiUrl}/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (!res.ok) {
        throw new Error(`Failed to update product with id ${id}`);
      }
      
      return res.json();
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      return undefined;
    }
  }
}

