import { fileURLToPath } from 'url';
import app from './app';
import logger from './config/logger';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, async () => {
    logger.info(`Server running on port ${port} -> http://localhost:${port}`);
  });
}

export {};
