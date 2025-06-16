export interface Env {
  PORT?: string;
  PRODUCT_API_URL?: string;
}

export const env: Env = {
  PORT: process.env.PORT,
  PRODUCT_API_URL: process.env.PRODUCT_API_URL
};
