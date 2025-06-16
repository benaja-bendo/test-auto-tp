import { fileURLToPath } from 'url';
import app from './app';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export {}; // to make this an ES module
