import { env } from './env';

export const config = {
  port: Number(env.PORT) || 3000,
  productApiUrl: env.PRODUCT_API_URL
};
