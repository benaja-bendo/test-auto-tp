# E-commerce Backend Example

This project provides a small example of a Node.js backend written in TypeScript. It demonstrates a basic e-commerce workflow with an emphasis on code quality and automated tests.

## Requirements
- Node.js >= 18
- pnpm or npm

## Scripts
- `npm run dev` – start the server with tsx in watch mode
- `npm run start` – run the server once
- `npm test` – run all unit, integration and E2E tests

## Project Structure
```
src/
  config/          Environment handling
  server.ts        Application entry point
  app.ts           Express instance
  routes/          Route definitions
  controllers/     Express handlers
  services/        Business logic
  models/          Type definitions
  views/           Static HTML pages
  public/          Browser JS and CSS

test/
  unit/            Unit tests for services
  integration/     API level integration tests
  e2e/             End to end scenarios
```

The services contain simple in-memory logic to keep the example concise. Payment and shipping are simulated via asynchronous services. A list of shipping options is exposed via `/shipping` and orders must specify a `shippingMethod` when created. The `ProductService` can optionally fetch products from an external `json-server` API when `PRODUCT_API_URL` is set.
