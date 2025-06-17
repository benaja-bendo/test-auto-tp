import { Carrier } from '../models/carrier';
import axios from 'axios';

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
}

const options: ShippingOption[] = [
  { id: 'standard', name: 'Standard', price: 5 },
  { id: 'express', name: 'Express', price: 10 }
];

export class ShippingService {
  private apiUrl = 'http://localhost:3001/carriers';

  getOptions(): ShippingOption[] {
    return options;
  }

  getCost(optionId: string): number {
    return options.find(o => o.id === optionId)?.price ?? 0;
  }

  async shipOrder(orderId: string, optionId: string): Promise<void> {
    // simulate external shipping API using selected option
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  async getAllCarriers(): Promise<Carrier[]> {
    try {
      const response = await axios.get(this.apiUrl);
      // Adapter les données du JSON server au format de notre modèle Carrier
      return response.data.map((carrier: any) => ({
        id: carrier.id,
        name: carrier.name,
        price: carrier['max-weight'] * 5, // Calcul du prix basé sur le poids max
        deliveryTime: carrier.service_type,
        description: carrier.features?.join(', ') || ''
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des transporteurs:', error);
      return [];
    }
  }

  async getCarrierById(id: string): Promise<Carrier | undefined> {
    try {
      const response = await axios.get(`${this.apiUrl}/${id}`);
      const carrier = response.data;
      
      if (!carrier) return undefined;
      
      return {
        id: carrier.id,
        name: carrier.name,
        price: carrier['max-weight'] * 5, // Calcul du prix basé sur le poids max
        deliveryTime: carrier.service_type,
        description: carrier.features?.join(', ') || ''
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération du transporteur ${id}:`, error);
      return undefined;
    }
  }
}
