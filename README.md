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
  controllers/     Express route handlers
  services/        Business logic
  models/          Type definitions
  app.ts           Express application

test/
  unit/            Unit tests for services
  integration/     API level integration tests
  e2e/             End to end scenarios
```

The services contain simple in-memory logic to keep the example concise. Payment and shipping are simulated via asynchronous services.
