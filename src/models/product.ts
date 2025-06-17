export interface Product {
  id: string;
  name: string;
  price: number;
  description_short?: string;
  description_long?: string;
  currency?: string;
  stock?: number;
  category?: string;
  weight?: number;
  images?: string[];
}
