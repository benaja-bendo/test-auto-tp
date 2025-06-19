import { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProductService } from '../services/productService';
import { CartService } from '../services/cartService';
import { OrderService } from '../services/orderService';
import { ShippingService } from '../services/shippingService';
import { PaymentService } from '../services/paymentService';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viewsDir = path.join(__dirname, '../views');

export class SiteController {
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private orderService: OrderService,
    private shippingService: ShippingService,
    private paymentService: PaymentService
  ) {}

  home = (_req: Request, res: Response): void => {
    res.sendFile(path.join(viewsDir, 'index.html'));
  };

  productPage = (_req: Request, res: Response): void => {
    res.sendFile(path.join(viewsDir, 'product.html'));
  };

  cartPage = (_req: Request, res: Response): void => {
    res.sendFile(path.join(viewsDir, 'cart.html'));
  };

  checkout = async (req: Request, res: Response): Promise<void> => {
    try {
      const cartItems = this.cartService.getItems();
      
      if (!cartItems || cartItems.length === 0) {
        return res.redirect('/cart');
      }
      
      const carriers = await this.shippingService.getAllCarriers();
      const paymentMethods = await this.paymentService.getAllPayments();
      
      // Envoyer la page de checkout avec les formulaires pour les informations client
      res.send(`
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Finaliser la commande</title>
            <link rel="stylesheet" href="/main.css" />
          </head>
          <body>
            <div id="header-container"></div>
            
            <main class="container">
              <h1>Finaliser la commande</h1>
              
              <div class="checkout-container">
                <div class="checkout-form">
                  <h2>Informations personnelles</h2>
                  <form id="checkout-form">
                    <div class="form-section">
                      <h3>Informations client</h3>
                      <div class="form-group">
                        <label for="firstName">Prénom</label>
                        <input type="text" id="firstName" name="firstName" required>
                      </div>
                      <div class="form-group">
                        <label for="lastName">Nom</label>
                        <input type="text" id="lastName" name="lastName" required>
                      </div>
                      <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                      </div>
                      <div class="form-group">
                        <label for="phone">Téléphone</label>
                        <input type="tel" id="phone" name="phone">
                      </div>
                    </div>
                    
                    <div class="form-section">
                      <h3>Adresse de livraison</h3>
                      <div class="form-group">
                        <label for="shippingStreet">Rue</label>
                        <input type="text" id="shippingStreet" name="shippingStreet" required>
                      </div>
                      <div class="form-group">
                        <label for="shippingCity">Ville</label>
                        <input type="text" id="shippingCity" name="shippingCity" required>
                      </div>
                      <div class="form-group">
                        <label for="shippingPostalCode">Code postal</label>
                        <input type="text" id="shippingPostalCode" name="shippingPostalCode" required>
                      </div>
                      <div class="form-group">
                        <label for="shippingCountry">Pays</label>
                        <input type="text" id="shippingCountry" name="shippingCountry" required>
                      </div>
                    </div>
                    
                    <div class="form-section">
                      <h3>Adresse de facturation</h3>
                      <div class="form-group">
                        <input type="checkbox" id="sameAsShipping" name="sameAsShipping">
                        <label for="sameAsShipping">Identique à l'adresse de livraison</label>
                      </div>
                      <div id="billing-address-fields">
                        <div class="form-group">
                          <label for="billingStreet">Rue</label>
                          <input type="text" id="billingStreet" name="billingStreet" required>
                        </div>
                        <div class="form-group">
                          <label for="billingCity">Ville</label>
                          <input type="text" id="billingCity" name="billingCity" required>
                        </div>
                        <div class="form-group">
                          <label for="billingPostalCode">Code postal</label>
                          <input type="text" id="billingPostalCode" name="billingPostalCode" required>
                        </div>
                        <div class="form-group">
                          <label for="billingCountry">Pays</label>
                          <input type="text" id="billingCountry" name="billingCountry" required>
                        </div>
                      </div>
                    </div>
                    
                    <div class="form-section">
                      <h3>Méthode de livraison</h3>
                      <div class="shipping-options">
                        ${carriers.map(carrier => `
                          <div class="form-group">
                            <input type="radio" id="carrier-${carrier.id}" name="carrierId" value="${carrier.id}" required>
                            <label for="carrier-${carrier.id}">${carrier.name} - ${carrier.price.toFixed(2)} €</label>
                            <p class="carrier-description">${carrier.description}</p>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                    
                    <div class="form-section">
                      <h3>Méthode de paiement</h3>
                      <div class="payment-options">
                        ${paymentMethods.map(payment => `
                          <div class="form-group">
                            <input type="radio" id="payment-${payment.id}" name="paymentMethod" value="${payment.id}" required>
                            <label for="payment-${payment.id}">${payment.name}</label>
                            <p class="payment-description">${payment.description}</p>
                          </div>
                        `).join('')}
                      </div>
                    </div>
                    
                    <div class="form-actions">
                      <button type="submit" class="button primary">Confirmer la commande</button>
                      <a href="/cart" class="button secondary">Retour au panier</a>
                    </div>
                  </form>
                </div>
                
                <div class="order-summary">
                  <h2>Récapitulatif de la commande</h2>
                  <div class="cart-items">
                    <!-- Les détails des articles seront chargés dynamiquement via JavaScript -->
                    <div id="cart-items-container"></div>
                  </div>
                  <div class="cart-total">
                    <span>Total</span>
                    <span id="cart-total">0.00 €</span>
                  </div>
                </div>
              </div>
            </main>
            
            <script src="/checkout.js"></script>
            <script>
              // Charger l'en-tête
              fetch('/views/partials/header.html')
                .then(response => response.text())
                .then(html => {
                  document.getElementById('header-container').innerHTML = html;
                });
                
              // Gérer la case à cocher pour l'adresse de facturation
              document.getElementById('sameAsShipping').addEventListener('change', function() {
                const billingFields = document.getElementById('billing-address-fields');
                billingFields.style.display = this.checked ? 'none' : 'block';
                
                if (this.checked) {
                  // Désactiver les champs de facturation s'ils sont identiques à la livraison
                  const billingInputs = billingFields.querySelectorAll('input');
                  billingInputs.forEach(input => input.required = false);
                } else {
                  // Réactiver les champs de facturation
                  const billingInputs = billingFields.querySelectorAll('input');
                  billingInputs.forEach(input => input.required = true);
                }
              });
              
              // Gérer la soumission du formulaire
              document.getElementById('checkout-form').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Créer le client
                const customerData = {
                  firstName: document.getElementById('firstName').value,
                  lastName: document.getElementById('lastName').value,
                  email: document.getElementById('email').value,
                  phone: document.getElementById('phone').value
                };
                
                try {
                  // Créer le client
                  const customerResponse = await fetch('/api/customers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(customerData)
                  });
                  
                  const customerResult = await customerResponse.json();
                  
                  if (!customerResponse.ok) {
                    throw new Error(customerResult.error || 'Erreur lors de la création du client');
                  }
                  
                  const customerId = customerResult.id;
                  
                  // Créer l'adresse de livraison
                  const shippingAddressData = {
                    type: 'shipping',
                    street: document.getElementById('shippingStreet').value,
                    city: document.getElementById('shippingCity').value,
                    postalCode: document.getElementById('shippingPostalCode').value,
                    country: document.getElementById('shippingCountry').value
                  };
                  
                  const shippingResponse = await fetch('/api/customers/' + customerId + '/addresses', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(shippingAddressData)
                  });
                  
                  const shippingResult = await shippingResponse.json();
                  
                  if (!shippingResponse.ok) {
                    throw new Error(shippingResult.error || 'Erreur lors de la création de l\'adresse de livraison');
                  }
                  
                  const shippingAddressId = shippingResult.id;
                  
                  // Créer l'adresse de facturation
                  let billingAddressId;
                  
                  if (document.getElementById('sameAsShipping').checked) {
                    // Utiliser la même adresse que la livraison
                    billingAddressId = shippingAddressId;
                  } else {
                    // Créer une nouvelle adresse de facturation
                    const billingAddressData = {
                      type: 'billing',
                      street: document.getElementById('billingStreet').value,
                      city: document.getElementById('billingCity').value,
                      postalCode: document.getElementById('billingPostalCode').value,
                      country: document.getElementById('billingCountry').value
                    };
                    
                    const billingResponse = await fetch('/api/customers/' + customerId + '/addresses', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(billingAddressData)
                    });
                    
                    const billingResult = await billingResponse.json();
                    
                    if (!billingResponse.ok) {
                      throw new Error(billingResult.error || 'Erreur lors de la création de l\'adresse de facturation');
                    }
                    
                    billingAddressId = billingResult.id;
                  }
                  
                  // Récupérer les valeurs des méthodes de livraison et de paiement
                  const carrierId = document.querySelector('input[name="carrierId"]:checked').value;
                  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
                  
                  // Créer la commande
                  const orderData = {
                    customerId,
                    carrierId,
                    paymentMethod,
                    shippingAddressId,
                    billingAddressId
                  };
                  
                  const orderResponse = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                  });
                  
                  const orderResult = await orderResponse.json();
                  
                  if (!orderResponse.ok) {
                    throw new Error(orderResult.error || 'Erreur lors de la création de la commande');
                  }
                  
                  // Rediriger vers la page de confirmation de commande
                  window.location.href = '/order-confirmation/' + orderResult.id;
                  
                } catch (error) {
                  console.error('Erreur lors du processus de commande:', error);
                  alert('Une erreur est survenue lors du processus de commande: ' + error.message);
                }
              });
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Erreur lors du chargement de la page de checkout:', error);
      res.status(500).send('Erreur lors du chargement de la page de checkout');
    }
  };
  
  orderConfirmation = async (req: Request, res: Response): Promise<void> => {
    try {
      const orderId = parseInt(req.params.orderId);
      
      if (isNaN(orderId)) {
        return res.redirect('/cart');
      }
      
      const order = await this.orderService.getOrderWithItems(orderId);
      
      // Rediriger vers une page de confirmation de commande
      res.send(`
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Commande Confirmée</title>
            <link rel="stylesheet" href="/main.css" />
          </head>
          <body>
            <div id="header-container"></div>
            
            <main class="container">
              <h1>Commande Confirmée</h1>
              <div class="order-confirmation">
                <p>Votre commande <strong>${order.id}</strong> a été confirmée.</p>
                <p>Statut: <span class="order-status">${order.status}</span></p>
                <p>Total: ${order.total.toFixed(2)} €</p>
                <p>Frais de livraison: ${order.shippingCost.toFixed(2)} €</p>
              </div>
              <div class="order-items">
                <h2>Articles commandés</h2>
                <ul>
                  ${order.items.map(item => `
                    <li>
                      <span class="item-quantity">${item.quantity}x</span>
                      <span class="item-id">${item.productId}</span>
                      <span class="item-price">${item.price.toFixed(2)} €</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
              <div class="order-actions">
                <a href="/" class="button">Retour à la boutique</a>
              </div>
            </main>
            
            <script>
              // Charger l'en-tête
              fetch('/views/partials/header.html')
                .then(response => response.text())
                .then(html => {
                  document.getElementById('header-container').innerHTML = html;
                });
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Erreur lors du chargement de la page de confirmation:', error);
      res.status(500).send('Erreur lors du chargement de la page de confirmation');
    }
  };
  
  // Méthode pour servir les fichiers partiels
  servePartial = (req: Request, res: Response): void => {
    const partialName = req.params.name;
    // Vérifier si le nom du fichier contient déjà l'extension .html
    const fileName = partialName.endsWith('.html') ? partialName : `${partialName}.html`;
    res.sendFile(path.join(viewsDir, 'partials', fileName));
  };
}
