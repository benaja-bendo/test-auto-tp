// Charger l'en-tête dans toutes les pages
document.addEventListener('DOMContentLoaded', function() {
  // Charger l'en-tête
  fetch('/views/partials/header.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('header-container').innerHTML = html;
      // Mettre à jour le compteur du panier après avoir chargé l'en-tête
      cartManager.updateCartCount();
    })
    .catch(error => console.error('Erreur lors du chargement de l\'en-tête:', error));

  // Si nous sommes sur la page du panier, charger les éléments du panier
  if (window.location.pathname === '/cart') {
    loadCartItems();

    // Ajouter un gestionnaire d'événements pour vider le panier
    document.getElementById('clear-cart').addEventListener('click', function() {
      if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
        cartManager.clearCart();
        loadCartItems();
        // Envoyer une requête au serveur pour vider le panier
        fetch('/api/cart/clear', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }).catch(error => console.error('Erreur lors de la suppression du panier sur le serveur:', error));
      }
    });
  }
});

// Fonction pour charger les éléments du panier
async function loadCartItems() {
  const cartItems = cartManager.loadCart();
  const cartLoading = document.getElementById('cart-loading');
  const cartEmpty = document.getElementById('cart-empty');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTableBody = document.getElementById('cart-table-body');
  const cartTotalAmount = document.getElementById('cart-total-amount');

  // Masquer le message de chargement
  cartLoading.style.display = 'none';

  // Vérifier si le panier est vide
  if (cartItems.length === 0) {
    cartEmpty.style.display = 'block';
    cartItemsContainer.style.display = 'none';
    return;
  }

  // Afficher les éléments du panier
  cartEmpty.style.display = 'none';
  cartItemsContainer.style.display = 'block';

  // Vider le tableau du panier
  cartTableBody.innerHTML = '';

  // Variable pour stocker le total du panier
  let cartTotal = 0;

  // Charger les détails de chaque produit dans le panier
  for (const item of cartItems) {
    try {
      const response = await fetch(`/api/products/${item.productId}`);
      const product = await response.json();

      // Calculer le total pour cet élément
      const itemTotal = product.price * item.quantity;
      cartTotal += itemTotal;

      // Créer une ligne pour cet élément
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="cart-product">
            ${product.images && product.images.length > 0 ? 
              `<img src="${product.images[0]}" alt="${product.name}" class="cart-product-image" style="width: 50px; height: 50px; object-fit: cover;">` : 
              ''}
            <div>
              <a href="/product/${product.id}">${product.name}</a>
              ${product.description_short ? `<p class="product-description">${product.description_short}</p>` : ''}
            </div>
          </div>
        </td>
        <td>${product.price.toFixed(2)} €</td>
        <td>
          <div class="quantity-control">
            <button class="quantity-btn decrease" data-product-id="${product.id}">-</button>
            <input type="number" value="${item.quantity}" min="1" max="${product.stock || 99}" class="quantity-input" data-product-id="${product.id}">
            <button class="quantity-btn increase" data-product-id="${product.id}">+</button>
          </div>
        </td>
        <td>${itemTotal.toFixed(2)} €</td>
        <td>
          <button class="remove-item" data-product-id="${product.id}">Supprimer</button>
        </td>
      `;

      cartTableBody.appendChild(row);
    } catch (error) {
      console.error(`Erreur lors du chargement du produit ${item.productId}:`, error);
    }
  }

  // Mettre à jour le total du panier
  cartTotalAmount.textContent = cartTotal.toFixed(2);
  
  // Ajouter les gestionnaires d'événements pour les boutons de quantité et de suppression
  addQuantityButtonListeners();
}

// Fonction pour ajouter des gestionnaires d'événements aux boutons de quantité et de suppression
function addQuantityButtonListeners() {
  // Gestionnaire pour les boutons de diminution de quantité
  document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.dataset.productId;
      const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
      let value = parseInt(input.value) - 1;
      if (value < 1) value = 1;
      input.value = value;
      updateCartItemQuantity(productId, value);
    });
  });

  // Gestionnaire pour les boutons d'augmentation de quantité
  document.querySelectorAll('.quantity-btn.increase').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.dataset.productId;
      const input = document.querySelector(`.quantity-input[data-product-id="${productId}"]`);
      const max = parseInt(input.getAttribute('max'));
      let value = parseInt(input.value) + 1;
      if (max && value > max) {
        value = max;
        alert('Quantité maximale atteinte (stock disponible)');
      }
      input.value = value;
      updateCartItemQuantity(productId, value);
    });
  });

  // Gestionnaire pour les champs de saisie de quantité
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', function() {
      const productId = this.dataset.productId;
      let value = parseInt(this.value);
      const max = parseInt(this.getAttribute('max'));
      
      if (isNaN(value) || value < 1) value = 1;
      if (max && value > max) {
        value = max;
        alert('Quantité maximale atteinte (stock disponible)');
      }
      
      this.value = value;
      updateCartItemQuantity(productId, value);
    });
  });

  // Gestionnaire pour les boutons de suppression
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.dataset.productId;
      if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
        cartManager.removeItem(productId);
        loadCartItems();
      }
    });
  });
}

// Fonction pour mettre à jour la quantité d'un élément du panier
function updateCartItemQuantity(productId, quantity) {
  cartManager.updateQuantity(productId, quantity);
  
  // Mettre à jour le total de l'élément et le total du panier
  updateCartTotals();
  
  // Synchroniser avec le serveur
  fetch('/api/cart/items', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productId, quantity })
  }).catch(error => console.error('Erreur lors de la mise à jour du panier sur le serveur:', error));
}

// Fonction pour mettre à jour les totaux du panier sans recharger toute la page
async function updateCartTotals() {
  const cartItems = cartManager.loadCart();
  const cartTotalAmount = document.getElementById('cart-total-amount');
  let cartTotal = 0;

  for (const item of cartItems) {
    try {
      const response = await fetch(`/api/products/${item.productId}`);
      const product = await response.json();
      const itemTotal = product.price * item.quantity;
      cartTotal += itemTotal;

      // Mettre à jour le total de cet élément dans le tableau
      const row = document.querySelector(`.quantity-input[data-product-id="${item.productId}"]`).closest('tr');
      const totalCell = row.cells[3];
      totalCell.textContent = `${itemTotal.toFixed(2)} €`;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du produit ${item.productId}:`, error);
    }
  }

  // Mettre à jour le total du panier
  cartTotalAmount.textContent = cartTotal.toFixed(2);
}