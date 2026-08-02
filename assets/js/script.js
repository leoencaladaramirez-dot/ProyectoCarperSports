const PHONE_NUMBER = "593998840690";

// Catálogo con Opciones de Tallas y Badges
const productos = [
  {
    id: 1,
    nombre: "Balón de Fútbol Mikasa FT-5",
    categoria: "Fútbol",
    precio: 38.00,
    badge: "MÁS VENDIDO",
    tag: "Oficial",
    tallas: ["N° 5 (Estándar)", "N° 4 (Juvenil)"],
    imagen: "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=600&q=80",
    descripcion: "Cuero sintético con termo-sellado ideal para cancha sintética y césped."
  },
  {
    id: 2,
    nombre: "Guantes de Portero Pro Grip",
    categoria: "Fútbol",
    precio: 25.00,
    badge: "OFERTA",
    tag: "Pro",
    tallas: ["Talla 8", "Talla 9", "Talla 10"],
    imagen: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=600&q=80",
    descripcion: "Agarre supremo con varillas de protección ajustables."
  },
  {
    id: 3,
    nombre: "Set de Conos de Entrenamiento (12u)",
    categoria: "Accesorios",
    precio: 12.00,
    badge: null,
    tag: "Entrenamiento",
    tallas: ["Multicolor"],
    imagen: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    descripcion: "Conos flexibles e irrompibles para circuitos de velocidad."
  },
  {
    id: 4,
    nombre: "Balón de Baloncesto Talla 7",
    categoria: "Accesorios",
    precio: 22.00,
    badge: null,
    tag: "Deportes",
    tallas: ["Talla 7 (Oficial)"],
    imagen: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80",
    descripcion: "Superficie rugosa de alto agarre para interiores y exteriores."
  }
];

let carrito = [];
let categoriaActual = 'Todos';

// Renderizar productos en pantalla
function renderProductos(lista = productos) {
  const grid = document.getElementById('products-grid');

  if (lista.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No se encontraron productos.</p>';
    return;
  }

  grid.innerHTML = lista.map(prod => `
    <div class="product-card">
      ${prod.badge ? `<span class="badge-promo">${prod.badge}</span>` : ''}
      <img src="${prod.imagen}" alt="${prod.nombre}" class="product-img">
      <div class="product-info">
        <span class="product-tag">${prod.tag}</span>
        <h3 class="product-title">${prod.nombre}</h3>
        <p class="product-desc">${prod.descripcion}</p>
        
        <div class="size-selector">
          <label for="size-${prod.id}">Medida / Talla:</label>
          <select id="size-${prod.id}">
            ${prod.tallas.map(t => `<option value="${t}">${t}</option>`).join('')}
          </select>
        </div>

        <div class="product-footer">
          <span class="product-price">$${prod.precio.toFixed(2)}</span>
          <button class="add-to-cart-btn" onclick="agregarAlCarrito(${prod.id})">+ Agregar</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Filtro de Búsqueda en tiempo real
function filtrarPorBusqueda() {
  const texto = document.getElementById('search-input').value.toLowerCase();
  const filtrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(texto) || 
    p.descripcion.toLowerCase().includes(texto)
  );
  renderProductos(filtrados);
}

// Filtro por categoría
function filtrarProductos(cat) {
  categoriaActual = cat;
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.innerText === cat);
  });
  
  const filtrados = cat === 'Todos' ? productos : productos.filter(p => p.categoria === cat);
  renderProductos(filtrados);
}

// Agregar al carrito considerando la talla elegida
function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  const tallaSelect = document.getElementById(`size-${id}`);
  const tallaElegida = tallaSelect ? tallaSelect.value : 'Única';

  const existe = carrito.find(item => item.id === id && item.talla === tallaElegida);

  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({ ...prod, talla: tallaElegida, cantidad: 1 });
  }

  actualizarCarrito();
  toggleCart(true);
}

function cambiarCantidad(id, talla, cambio) {
  const item = carrito.find(p => p.id === id && p.talla === talla);
  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) {
      carrito = carrito.filter(p => !(p.id === id && p.talla === talla));
    }
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  const container = document.getElementById('cart-items');
  const countEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total');

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  countEl.innerText = totalItems;

  if (carrito.length === 0) {
    container.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío ⚽</p>';
    totalEl.innerText = '$0.00';
    return;
  }

  container.innerHTML = carrito.map(item => `
    <div class="cart-item">
      <img src="${item.imagen}" alt="${item.nombre}">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.nombre}</div>
        <div class="cart-item-meta">Opción: ${item.talla}</div>
        <div class="cart-item-price">$${(item.precio * item.cantidad).toFixed(2)}</div>
        <div style="margin-top:4px;">
          <button onclick="cambiarCantidad(${item.id}, '${item.talla}', -1)">-</button>
          <span style="margin: 0 6px;">${item.cantidad}</span>
          <button onclick="cambiarCantidad(${item.id}, '${item.talla}', 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  totalEl.innerText = `$${total.toFixed(2)}`;
}

function toggleCart(forceOpen = false) {
  const modal = document.getElementById('cart-modal');
  const overlay = document.getElementById('cart-overlay');
  
  if (forceOpen || !modal.classList.contains('open')) {
    modal.classList.add('open');
    overlay.classList.add('show');
  } else {
    modal.classList.remove('open');
    overlay.classList.remove('show');
  }
}

function enviarAWhatsApp() {
  if (carrito.length === 0) return;

  let mensaje = "¡Hola *CarperSports*! 👋 Quisiera realizar el siguiente pedido desde la web:\n\n";
  let total = 0;

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    mensaje += `• *${item.nombre}* (${item.talla})\n  Cantidad: ${item.cantidad} | Subtotal: $${subtotal.toFixed(2)}\n\n`;
  });

  mensaje += `💰 *TOTAL A PAGAR:* $${total.toFixed(2)}\n\n`;
  mensaje += "Quedo a la espera de sus datos para el pago y envío. ¡Gracias!";

  window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
}

renderProductos();