import { DataSource } from 'typeorm';
import path from 'path';
import { fileURLToPath } from 'url';
import { Order } from '../entities/Order';
import { OrderItem } from '../entities/OrderItem';
import { Customer } from '../entities/Customer';
import { Address } from '../entities/Address';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.NODE_ENV === 'test'
  ? ':memory:'
  : path.join(__dirname, '../../db/ecommerce.sqlite');

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath,
  synchronize: true, // En développement -> True, en production -> False
  logging: true,
  entities: [Order, OrderItem, Customer, Address],
  migrations: [],
  subscribers: []
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Base de données initialisée avec succès');
    return AppDataSource;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
};