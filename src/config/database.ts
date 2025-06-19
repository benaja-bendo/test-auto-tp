import { DataSource } from 'typeorm';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../db/ecommerce.sqlite');

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: dbPath,
  synchronize: true, // En développement -> True, en production -> False
  logging: true,
  entities: [
    path.join(__dirname, '../entities/*.ts'),
    path.join(__dirname, '../entities/*.js')
  ],
  migrations: [
    path.join(__dirname, '../migrations/*.ts')
  ],
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