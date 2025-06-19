// Gestionnaire de checkout
const checkoutManager = {
  init() {
    // Initialiser les gestionnaires d'événements
    this.initEventListeners();
  },

  initEventListeners() {
    // Gérer la case à cocher pour l'adresse de facturation
    const sameAsShippingCheckbox = document.getElementById('sameAsShipping');
    if (sameAsShippingCheckbox) {
      sameAsShippingCheckbox.addEventListener('change', this.toggleBillingAddress);
      // Initialiser l'état
      this.toggleBillingAddress({ target: sameAsShippingCheckbox });
    }

    // Gérer la soumission du formulaire
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', this.handleSubmit.bind(this));
    }
  },

  toggleBillingAddress(event) {
    const billingFields = document.getElementById('billing-address-fields');
    if (!billingFields) return;

    const isChecked = event.target.checked;
    billingFields.style.display = isChecked ? 'none' : 'block';

    // Désactiver/activer les champs requis
    const billingInputs = billingFields.querySelectorAll('input');
    billingInputs.forEach(input => {
      input.required = !isChecked;
    });
  },

  async handleSubmit(event) {
    event.preventDefault();

    try {
      // Afficher un indicateur de chargement
      this.showLoading();

      // 1. Créer le client
      const customerId = await this.createCustomer();
      if (!customerId) throw new Error('Échec de la création du client');

      // 2. Créer l'adresse de livraison
      const shippingAddressId = await this.createShippingAddress(customerId);
      if (!shippingAddressId) throw new Error('Échec de la création de l\'adresse de livraison');

      // 3. Créer l'adresse de facturation ou utiliser celle de livraison
      const billingAddressId = await this.createBillingAddress(customerId, shippingAddressId);
      if (!billingAddressId) throw new Error('Échec de la création de l\'adresse de facturation');

      // 4. Créer la commande
      const orderId = await this.createOrder(customerId, shippingAddressId, billingAddressId);
      if (!orderId) throw new Error('Échec de la création de la commande');

      // 5. Rediriger vers la page de confirmation
      window.location.href = `/order-confirmation/${orderId}`;
    } catch (error) {
      console.error('Erreur lors du processus de commande:', error);
      this.showError(error.message);
    } finally {
      this.hideLoading();
    }
  },

  async createCustomer() {
    const customerData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value
    };

    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erreur lors de la création du client');
    }

    return result.id;
  },

  async createShippingAddress(customerId) {
    const addressData = {
      type: 'shipping',
      street: document.getElementById('shippingStreet').value,
      city: document.getElementById('shippingCity').value,
      postalCode: document.getElementById('shippingPostalCode').value,
      country: document.getElementById('shippingCountry').value
    };

    const response = await fetch(`/api/customers/${customerId}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erreur lors de la création de l\'adresse de livraison');
    }

    return result.id;
  },

  async createBillingAddress(customerId, shippingAddressId) {
    const sameAsShipping = document.getElementById('sameAsShipping').checked;

    if (sameAsShipping) {
      return shippingAddressId;
    }

    const addressData = {
      type: 'billing',
      street: document.getElementById('billingStreet').value,
      city: document.getElementById('billingCity').value,
      postalCode: document.getElementById('billingPostalCode').value,
      country: document.getElementById('billingCountry').value
    };

    const response = await fetch(`/api/customers/${customerId}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erreur lors de la création de l\'adresse de facturation');
    }

    return result.id;
  },

  async createOrder(customerId, shippingAddressId, billingAddressId) {
    const carrierId = document.querySelector('input[name="carrierId"]:checked').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    const orderData = {
      customerId,
      carrierId,
      paymentMethod,
      shippingAddressId,
      billingAddressId
    };

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erreur lors de la création de la commande');
    }

    return result.id;
  },

  showLoading() {
    // Créer un élément de chargement s'il n'existe pas déjà
    if (!document.getElementById('loading-overlay')) {
      const loadingOverlay = document.createElement('div');
      loadingOverlay.id = 'loading-overlay';
      loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Traitement de votre commande...</p>
      `;
      document.body.appendChild(loadingOverlay);

      // Ajouter du style pour l'overlay
      const style = document.createElement('style');
      style.textContent = `
        #loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          color: white;
        }
        .loading-spinner {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    } else {
      document.getElementById('loading-overlay').style.display = 'flex';
    }
  },

  hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.display = 'none';
    }
  },

  showError(message) {
    // Créer un élément d'erreur s'il n'existe pas déjà
    if (!document.getElementById('error-message')) {
      const errorElement = document.createElement('div');
      errorElement.id = 'error-message';
      errorElement.className = 'error-notification';
      document.body.appendChild(errorElement);

      // Ajouter du style pour la notification d'erreur
      const style = document.createElement('style');
      style.textContent = `
        .error-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background-color: #f44336;
          color: white;
          padding: 15px;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          max-width: 300px;
        }
      `;
      document.head.appendChild(style);
    }

    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // Masquer le message après 5 secondes
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }
};

// Initialiser le gestionnaire de checkout lorsque la page est chargée
document.addEventListener('DOMContentLoaded', () => {
  checkoutManager.init();
});