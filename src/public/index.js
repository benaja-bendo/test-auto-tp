const listEl = document.getElementById('product-list');
const paginationEl = document.getElementById('pagination');
let currentPage = 1;
const perPage = 12;

async function loadProducts(page) {
  const res = await fetch('/api/products');
  const products = await res.json();
  const start = (page - 1) * perPage;
  const pageItems = products.slice(start, start + perPage);
  listEl.innerHTML = pageItems
    .map(p => `<li><a href="/products/${p.id}">${p.name} - $${p.price}</a></li>`)
    .join('');
  const pages = Math.ceil(products.length / perPage);
  paginationEl.innerHTML = '';
  for (let i = 1; i <= pages; i++) {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = i;
    if (i === page) link.style.fontWeight = 'bold';
    link.addEventListener('click', e => {
      e.preventDefault();
      currentPage = i;
      loadProducts(i);
    });
    paginationEl.appendChild(link);
    paginationEl.appendChild(document.createTextNode(' '));
  }
}

loadProducts(currentPage);
