// Script pour la page de confirmation de commande
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Récupérer l'ID de commande depuis l'URL
    const orderId = window.location.pathname.split('/').pop();
    document.getElementById('order-id').textContent = orderId;
    
    // Récupérer les détails de la commande depuis l'API
    const response = await fetch(`/api/orders/${orderId}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des détails de la commande');
    }
    
    const order = await response.json();
    
    // Afficher les détails de la commande
    document.getElementById('order-date').textContent = new Date(order.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    document.getElementById('order-status').textContent = order.status;
    document.getElementById('payment-method').textContent = order.paymentMethod;
    
    // Afficher l'adresse de livraison
    const shippingAddress = order.shippingAddress;
    document.getElementById('shipping-address').innerHTML = `
      <p>${order.customer.firstName} ${order.customer.lastName}</p>
      <p>${shippingAddress.street}</p>
      <p>${shippingAddress.postalCode} ${shippingAddress.city}</p>
      <p>${shippingAddress.country}</p>
    `;
    
    // Afficher l'adresse de facturation
    const billingAddress = order.billingAddress;
    document.getElementById('billing-address').innerHTML = `
      <p>${order.customer.firstName} ${order.customer.lastName}</p>
      <p>${billingAddress.street}</p>
      <p>${billingAddress.postalCode} ${billingAddress.city}</p>
      <p>${billingAddress.country}</p>
    `;
    
    // Afficher les articles commandés
    const orderItemsContainer = document.getElementById('order-items');
    let subtotal = 0;
    
    order.orderItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.product.name}</td>
        <td>${item.price.toFixed(2)} €</td>
        <td>${item.quantity}</td>
        <td>${itemTotal.toFixed(2)} €</td>
      `;
      
      orderItemsContainer.appendChild(row);
    });
    
    // Afficher les totaux
    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)} €`;
    document.getElementById('shipping-cost').textContent = `${order.shippingCost.toFixed(2)} €`;
    document.getElementById('total').textContent = `${order.total.toFixed(2)} €`;
    
  } catch (error) {
    console.error('Erreur:', error);
    alert('Une erreur est survenue lors du chargement des détails de la commande.');
  }
});