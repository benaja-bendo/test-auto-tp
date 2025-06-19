import winston from 'winston';
import { env } from './env';

// Définir les niveaux de log et leurs couleurs
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Définir différents couleurs pour chaque niveau de log
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Ajouter les couleurs à winston
winston.addColors(colors);

// Définir le niveau de log en fonction de l'environnement
const level = () => {
  const nodeEnv = env.NODE_ENV || 'development';
  return nodeEnv === 'development' ? 'debug' : 'warn';
};

// Définir le format de log
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Définir les transports (où les logs seront stockés)
const transports = [
  // Afficher les logs dans la console
  new winston.transports.Console(),
  // Stocker les logs d'erreur dans un fichier
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // Stocker tous les logs dans un autre fichier
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// Créer l'instance de logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;