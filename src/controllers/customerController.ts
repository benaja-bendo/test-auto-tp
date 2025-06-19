import { Request, Response } from 'express';
import { CustomerService } from '../services/customerService';

export class CustomerController {
  constructor(private customerService: CustomerService) {}

  async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { firstName, lastName, email, phone } = req.body;
      
      // Validation de base
      if (!firstName || !lastName || !email) {
        res.status(400).json({ error: 'Les champs prénom, nom et email sont obligatoires' });
        return;
      }
      
      // Vérifier si le client existe déjà
      const existingCustomer = await this.customerService.findByEmail(email);
      if (existingCustomer) {
        res.status(409).json({ error: 'Un client avec cet email existe déjà', customerId: existingCustomer.id });
        return;
      }
      
      // Créer le client
      const customer = await this.customerService.createCustomer({
        firstName,
        lastName,
        email,
        phone
      });
      
      res.status(201).json(customer);
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      res.status(500).json({ error: 'Erreur lors de la création du client' });
    }
  }

  async addAddress(req: Request, res: Response): Promise<void> {
    try {
      const customerId = parseInt(req.params.customerId);
      const { type, street, city, postalCode, country } = req.body;
      
      // Validation de base
      if (!type || !street || !city || !postalCode || !country) {
        res.status(400).json({ error: 'Tous les champs d\'adresse sont obligatoires' });
        return;
      }
      
      if (type !== 'billing' && type !== 'shipping') {
        res.status(400).json({ error: 'Le type d\'adresse doit être "billing" ou "shipping"' });
        return;
      }
      
      // Vérifier si le client existe
      const customer = await this.customerService.getCustomerWithAddresses(customerId);
      if (!customer) {
        res.status(404).json({ error: 'Client non trouvé' });
        return;
      }
      
      // Vérifier si une adresse de ce type existe déjà
      const existingAddress = await this.customerService.getAddressByType(customerId, type as 'billing' | 'shipping');
      if (existingAddress) {
        res.status(409).json({ 
          error: `Une adresse de type ${type} existe déjà pour ce client`, 
          addressId: existingAddress.id 
        });
        return;
      }
      
      // Créer l'adresse
      const address = await this.customerService.addAddress(customerId, {
        type: type as 'billing' | 'shipping',
        street,
        city,
        postalCode,
        country
      });
      
      res.status(201).json(address);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'adresse:', error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'adresse' });
    }
  }

  async getCustomerAddresses(req: Request, res: Response): Promise<void> {
    try {
      const customerId = parseInt(req.params.customerId);
      
      const customer = await this.customerService.getCustomerWithAddresses(customerId);
      if (!customer) {
        res.status(404).json({ error: 'Client non trouvé' });
        return;
      }
      
      res.json(customer.addresses || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des adresses:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des adresses' });
    }
  }
}