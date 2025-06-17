// Gestion du panier avec localStorage
class CartManager {
  constructor() {
    this.cartItems = this.loadCart();
    this.updateCartCount();
  }

  // Charger le panier depuis localStorage
  loadCart() {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  // Sauvegarder le panier dans localStorage
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.updateCartCount();
  }

  // Mettre à jour le compteur du panier dans l'en-tête
  updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
      const itemCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
      cartCountElement.textContent = itemCount.toString();
    }
  }

  // Ajouter un produit au panier
  addToCart(productId, quantity, callback) {
    // Vérifier d'abord le stock disponible
    this.checkStock(productId, quantity).then(available => {
      if (available) {
        // Ajouter au panier local
        const existingItem = this.cartItems.find(item => item.productId === productId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          this.cartItems.push({ productId, quantity });
        }
        this.saveCart();

        // Synchroniser avec le serveur
        fetch('/cart/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ productId, quantity })
        }).then(response => {
          if (callback) callback(true);
        }).catch(error => {
          console.error('Error updating cart on server:', error);
          if (callback) callback(false);
        });
      } else {
        alert('Stock insuffisant pour ce produit');
        if (callback) callback(false);
      }
    });
  }

  // Vérifier le stock disponible
  async checkStock(productId, requestedQuantity) {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const product = await response.json();
      
      // Si le stock n'est pas défini, on suppose qu'il est disponible
      if (product.stock === undefined) return true;
      
      // Vérifier si le stock est suffisant
      const currentCartQuantity = this.getCurrentQuantity(productId);
      return product.stock >= (currentCartQuantity + requestedQuantity);
    } catch (error) {
      console.error('Error checking stock:', error);
      return false;
    }
  }

  // Obtenir la quantité actuelle d'un produit dans le panier
  getCurrentQuantity(productId) {
    const item = this.cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }

  // Mettre à jour la quantité d'un produit
  updateQuantity(productId, quantity) {
    const item = this.cartItems.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeItem(productId);
      } else {
        this.saveCart();
      }
    }
  }

  // Supprimer un produit du panier
  removeItem(productId) {
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.saveCart();
  }

  // Vider le panier
  clearCart() {
    this.cartItems = [];
    this.saveCart();
  }
}

// Initialiser le gestionnaire de panier
const cartManager = new CartManager();

// Exposer le gestionnaire de panier globalement
window.cartManager = cartManager;