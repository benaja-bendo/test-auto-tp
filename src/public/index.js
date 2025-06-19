// Variables globales
let allProducts = [];
let currentPage = 1;
let productsPerPage = 12;
let currentCategory = '';
let currentSearch = '';

// Charger l'en-tête dans toutes les pages
document.addEventListener('DOMContentLoaded', function() {
  // Charger l'en-tête
  fetch('/views/partials/header.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('header-container').innerHTML = html;
      // Mettre à jour le compteur du panier après avoir chargé l'en-tête
      if (window.cartManager) {
        cartManager.updateCartCount();
      }
    })
    .catch(error => console.error('Erreur lors du chargement de l\'en-tête:', error));

  // Charger les produits
  loadProducts();

  // Ajouter les gestionnaires d'événements pour les filtres
  document.getElementById('search-input').addEventListener('input', function(e) {
    currentSearch = e.target.value.trim().toLowerCase();
    currentPage = 1;
    displayProducts();
  });

  document.getElementById('category-filter').addEventListener('change', function(e) {
    currentCategory = e.target.value;
    currentPage = 1;
    displayProducts();
  });
});

// Fonction pour charger tous les produits
async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    allProducts = await response.json();
    
    // Extraire et remplir les catégories uniques
    populateCategories();
    
    // Afficher les produits
    displayProducts();
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
    document.getElementById('product-grid').innerHTML = '<p>Erreur lors du chargement des produits. Veuillez réessayer plus tard.</p>';
  }
}

// Fonction pour remplir le filtre de catégories
function populateCategories() {
  const categoryFilter = document.getElementById('category-filter');
  const categories = new Set();
  
  // Collecter toutes les catégories uniques
  allProducts.forEach(product => {
    if (product.category) {
      categories.add(product.category);
    }
  });
  
  // Ajouter les options de catégorie au select
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Fonction pour filtrer les produits
function filterProducts() {
  return allProducts.filter(product => {
    // Filtrer par catégorie si une catégorie est sélectionnée
    const categoryMatch = !currentCategory || product.category === currentCategory;
    
    // Filtrer par recherche si une recherche est effectuée
    const searchMatch = !currentSearch || 
      product.name.toLowerCase().includes(currentSearch) || 
      (product.description_short && product.description_short.toLowerCase().includes(currentSearch));
    
    return categoryMatch && searchMatch;
  });
}

// Fonction pour afficher les produits filtrés et paginés
function displayProducts() {
  const productGrid = document.getElementById('product-grid');
  const paginationContainer = document.getElementById('pagination');
  
  // Filtrer les produits
  const filteredProducts = filterProducts();
  
  // Calculer la pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToDisplay = filteredProducts.slice(startIndex, endIndex);
  
  // Vider la grille de produits
  productGrid.innerHTML = '';
  
  // Afficher un message si aucun produit ne correspond aux filtres
  if (productsToDisplay.length === 0) {
    productGrid.innerHTML = '<p>Aucun produit ne correspond à votre recherche.</p>';
    paginationContainer.innerHTML = '';
    return;
  }
  
  // Créer les cartes de produits
  productsToDisplay.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    // Déterminer la classe de stock
    let stockClass = '';
    let stockText = 'En stock';
    
    if (product.stock !== undefined) {
      if (product.stock > 10) {
        stockClass = 'stock-high';
        stockText = `${product.stock} en stock`;
      } else if (product.stock > 3) {
        stockClass = 'stock-medium';
        stockText = `${product.stock} en stock`;
      } else if (product.stock > 0) {
        stockClass = 'stock-low';
        stockText = `Seulement ${product.stock} en stock !`;
      } else {
        stockClass = 'stock-low';
        stockText = 'Rupture de stock';
      }
    }
    
    productCard.innerHTML = `
      <a href="/product/${product.id}">
        ${product.images && product.images.length > 0 ? 
          `<img src="${product.images[0]}" alt="${product.name}" class="product-image">` : 
          '<div class="product-image-placeholder"></div>'}
        <div class="product-info">
          <h3 class="product-title">${product.name}</h3>
          <p class="product-price">${product.price.toFixed(2)} €</p>
          ${product.description_short ? `<p class="product-description">${product.description_short}</p>` : ''}
          <p class="product-stock ${stockClass}">${stockText}</p>
        </div>
      </a>
    `;
    
    productGrid.appendChild(productCard);
  });
  
  // Créer la pagination
  createPagination(totalPages);
}

// Fonction pour créer la pagination
function createPagination(totalPages) {
  const paginationContainer = document.getElementById('pagination');
  paginationContainer.innerHTML = '';
  
  // Ne pas afficher la pagination s'il n'y a qu'une seule page
  if (totalPages <= 1) return;
  
  // Ajouter le bouton précédent
  if (currentPage > 1) {
    const prevLink = document.createElement('a');
    prevLink.href = '#';
    prevLink.textContent = '«';
    prevLink.addEventListener('click', e => {
      e.preventDefault();
      currentPage--;
      displayProducts();
      window.scrollTo(0, 0);
    });
    paginationContainer.appendChild(prevLink);
  }
  
  // Déterminer les pages à afficher
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  // Ajuster si on est proche de la fin
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  // Ajouter les liens de page
  for (let i = startPage; i <= endPage; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.textContent = i;
    if (i === currentPage) {
      pageLink.className = 'active';
    }
    pageLink.addEventListener('click', e => {
      e.preventDefault();
      currentPage = i;
      displayProducts();
      window.scrollTo(0, 0);
    });
    paginationContainer.appendChild(pageLink);
  }
  
  // Ajouter le bouton suivant
  if (currentPage < totalPages) {
    const nextLink = document.createElement('a');
    nextLink.href = '#';
    nextLink.textContent = '»';
    nextLink.addEventListener('click', e => {
      e.preventDefault();
      currentPage++;
      displayProducts();
      window.scrollTo(0, 0);
    });
    paginationContainer.appendChild(nextLink);
  }
}
