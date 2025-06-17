# TP Auto EPSI - Backend E-commerce

Une application backend e-commerce moderne développée avec Node.js et TypeScript, offrant une API RESTful complète et une interface utilisateur simple pour la gestion des produits, du panier et des commandes.

## 🚀 Fonctionnalités

- **Catalogue de produits** : Affichage et recherche de produits avec pagination
- **Gestion du panier** : Ajout, modification et suppression d'articles
- **Processus de commande** : Paiement simulé et options d'expédition
- **API RESTful** : Endpoints documentés pour l'intégration avec des frontends
- **Interface utilisateur simple** : Pages HTML basiques pour tester les fonctionnalités

## 🛠️ Technologies

- **Backend** : Node.js, Express, TypeScript
- **Tests** : Vitest, Supertest
- **Données** : JSON Server (optionnel pour les données externes)

## 📋 Prérequis

- Node.js >= 18
- npm ou pnpm

## 🔧 Installation

1. Clonez le dépôt :
   ```bash
   git clone [URL_DU_REPO]
   cd tp-auto-epsi
   ```

2. Installez les dépendances :
   ```bash
   npm install
   # ou avec pnpm
   pnpm install
   ```

3. Configurez les variables d'environnement (optionnel) :
   ```bash
   cp .env.example .env
   # Modifiez .env selon vos besoins
   ```

## 🚀 Démarrage

### Application principale

```bash
# Mode développement avec rechargement automatique
npm run dev

# Démarrage simple
npm start
```

L'application sera accessible à l'adresse : http://localhost:3000

### Serveur JSON (optionnel)

Pour utiliser le serveur JSON avec des données de produits plus complètes :

```bash
# Installation globale de json-server (si nécessaire)
npm install -g json-server

# Démarrage du serveur JSON
json-server --watch jsonserver/data.json --port 3001
```

Ensuite, configurez l'application pour utiliser l'API externe :
```bash
# Dans .env
PRODUCT_API_URL=http://localhost:3001
```

## 🧪 Tests

```bash
# Exécuter tous les tests
npm test

# Mode watch pour le développement
npm run test:watch
```

## 📁 Structure du projet

```
src/
  ├── config/          # Configuration et variables d'environnement
  ├── controllers/     # Contrôleurs Express
  ├── middlewares/     # Middlewares Express
  ├── models/          # Définitions de types et interfaces
  ├── public/          # Fichiers statiques (JS, CSS)
  ├── routes/          # Définitions des routes API
  ├── services/        # Logique métier
  ├── views/           # Pages HTML
  ├── app.ts           # Configuration de l'application Express
  └── server.ts        # Point d'entrée de l'application

test/
  ├── unit/            # Tests unitaires des services
  ├── integration/     # Tests d'intégration de l'API
  └── e2e/             # Tests end-to-end des scénarios utilisateur

jsonserver/            # Données et configuration pour JSON Server
```

## 📝 API Endpoints

### Produits
- `GET /api/products` - Liste tous les produits
- `GET /api/products/:id` - Détails d'un produit spécifique

### Panier
- `GET /api/cart` - Affiche le contenu du panier
- `POST /api/cart/items` - Ajoute un article au panier

### Commandes
- `POST /api/orders` - Crée une nouvelle commande

### Expédition
- `GET /api/shipping` - Liste les options d'expédition disponibles

## 🔄 Flux de commande

1. Parcourir les produits (`GET /api/products`)
2. Ajouter des produits au panier (`POST /api/cart/items`)
3. Créer une commande avec une méthode d'expédition (`POST /api/orders`)
4. Le paiement est simulé et la commande est automatiquement expédiée

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).
