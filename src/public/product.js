const detailEl = document.getElementById('product-detail');
const id = location.pathname.split('/').pop();
fetch(`/api/products/${id}`)
  .then(r => r.json())
  .then(p => {
    detailEl.innerHTML = `
      <h1>${p.name}</h1>
      <p>Price: $${p.price}</p>
      <form method="post" action="/cart/items">
        <input type="hidden" name="productId" value="${p.id}">
        <input type="number" name="quantity" value="1" min="1">
        <button type="submit">Add to Cart</button>
      </form>
      <a href="/">Back to catalogue</a>
    `;
  });
