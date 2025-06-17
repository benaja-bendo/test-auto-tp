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

  // Charger les détails du produit
  loadProductDetails();
});

// Fonction pour charger les détails du produit
async function loadProductDetails() {
  const productDetailContainer = document.getElementById('product-detail');
  const id = location.pathname.split('/').pop();
  
  try {
    const response = await fetch(`/api/products/${id}`);
    const product = await response.json();
    
    // Créer la structure HTML pour les détails du produit
    const productDetailHTML = `
      <div class="product-detail-images">
        ${product.images && product.images.length > 0 ? 
          `<img src="${product.images[0]}" alt="${product.name}" class="product-detail-image">` : 
          '<div class="product-image-placeholder"></div>'}
      </div>
      <div class="product-detail-info">
        <h1 class="product-detail-title">${product.name}</h1>
        <p class="product-detail-price">${product.price.toFixed(2)} €</p>
        
        ${product.description_long ? 
          `<div class="product-detail-description">${product.description_long}</div>` : 
          (product.description_short ? 
            `<div class="product-detail-description">${product.description_short}</div>` : 
            '')}
        
        <div class="product-stock-info">
          ${getStockDisplay(product.stock)}
        </div>
        
        <form id="add-to-cart-form" class="add-to-cart-form">
          <div class="form-group">
            <label for="quantity">Quantité:</label>
            <div class="quantity-control">
              <button type="button" class="quantity-btn decrease">-</button>
              <input type="number" id="quantity" name="quantity" value="1" min="1" ${product.stock ? `max="${product.stock}"` : ''}>
              <button type="button" class="quantity-btn increase">+</button>
            </div>
          </div>
          <button type="submit" class="button" ${product.stock === 0 ? 'disabled' : ''}>Ajouter au panier</button>
        </form>
      </div>
    `;
    
    productDetailContainer.innerHTML = productDetailHTML;
    
    // Ajouter les gestionnaires d'événements pour le formulaire d'ajout au panier
    setupAddToCartForm(product);
    
  } catch (error) {
    console.error('Erreur lors du chargement des détails du produit:', error);
    productDetailContainer.innerHTML = '<p>Erreur lors du chargement des détails du produit. Veuillez réessayer plus tard.</p>';
  }
}

// Fonction pour obtenir l'affichage du stock
function getStockDisplay(stock) {
  if (stock === undefined) return '<p class="stock-high">En stock</p>';
  
  if (stock > 10) {
    return `<p class="stock-high">En stock</p>`;
  } else if (stock > 3) {
    return `<p class="stock-medium">${stock} en stock</p>`;
  } else if (stock > 0) {
    return `<p class="stock-low">Seulement ${stock} en stock !</p>`;
  } else {
    return `<p class="stock-low">Rupture de stock</p>`;
  }
}

// Fonction pour configurer le formulaire d'ajout au panier
function setupAddToCartForm(product) {
  const form = document.getElementById('add-to-cart-form');
  const quantityInput = form.querySelector('#quantity');
  const decreaseBtn = form.querySelector('.quantity-btn.decrease');
  const increaseBtn = form.querySelector('.quantity-btn.increase');
  
  // Gestionnaire pour le bouton de diminution de quantité
  decreaseBtn.addEventListener('click', function() {
    let value = parseInt(quantityInput.value) - 1;
    if (value < 1) value = 1;
    quantityInput.value = value;
  });
  
  // Gestionnaire pour le bouton d'augmentation de quantité
  increaseBtn.addEventListener('click', function() {
    let value = parseInt(quantityInput.value) + 1;
    const max = parseInt(quantityInput.getAttribute('max'));
    if (max && value > max) {
      value = max;
      alert('Quantité maximale atteinte (stock disponible)');
    }
    quantityInput.value = value;
  });
  
  // Gestionnaire pour le champ de saisie de quantité
  quantityInput.addEventListener('change', function() {
    let value = parseInt(this.value);
    const max = parseInt(this.getAttribute('max'));
    
    if (isNaN(value) || value < 1) value = 1;
    if (max && value > max) {
      value = max;
      alert('Quantité maximale atteinte (stock disponible)');
    }
    
    this.value = value;
  });
  
  // Gestionnaire pour le formulaire d'ajout au panier
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const quantity = parseInt(quantityInput.value);
    
    // Vérifier si la quantité est valide
    if (isNaN(quantity) || quantity < 1) {
      alert('Veuillez entrer une quantité valide.');
      return;
    }
    
    // Vérifier si le produit est en stock
    if (product.stock !== undefined && product.stock < quantity) {
      alert(`Désolé, il n'y a que ${product.stock} unités en stock.`);
      return;
    }
    
    // Ajouter au panier
    if (window.cartManager) {
      cartManager.addToCart(product.id, quantity, success => {
        if (success) {
          alert('Produit ajouté au panier avec succès !');
        }
      });
    } else {
      // Fallback si cartManager n'est pas disponible
      fetch('/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: product.id, quantity })
      })
      .then(response => {
        if (response.ok) {
          alert('Produit ajouté au panier avec succès !');
        } else {
          alert('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
        }
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout au panier:', error);
        alert('Erreur lors de l\'ajout au panier. Veuillez réessayer.');
      });
    }
  });
}
