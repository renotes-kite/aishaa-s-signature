// Shared product data for all pages.
const products = [
  {
    id: 1,
    name: "Necklace",
    price: 890,
    description: "Delicate gold chain with a graceful center piece.",
    image: "images/necklace.svg",
    material: "18K gold",
    stone: "Champagne diamond",
    weight: "12g",
    craftsmanship: "Hand-polished by master goldsmiths"
  },
  {
    id: 2,
    name: "Diamond Ring",
    price: 1200,
    description: "Elegant hand-set diamond ring.",
    image: "images/diamond-ring.svg",
    material: "Platinum",
    stone: "VS1 natural diamond",
    weight: "6g",
    craftsmanship: "Precision pavé setting"
  },
  {
    id: 3,
    name: "Gold Bracelet",
    price: 760,
    description: "Classic gold bracelet with modern sophistication.",
    image: "images/gold-bracelet.svg",
    material: "22K gold",
    stone: "None",
    weight: "24g",
    craftsmanship: "Interlocked artisan links"
  },
  {
    id: 4,
    name: "Pearl Earrings",
    price: 640,
    description: "Lustrous pearls for timeless evening charm.",
    image: "images/pearl-earrings.svg",
    material: "14K gold",
    stone: "South Sea pearls",
    weight: "8g",
    craftsmanship: "Balanced twin-drop design"
  },
  {
    id: 5,
    name: "Sapphire Pendant",
    price: 980,
    description: "Regal sapphire pendant with refined detailing.",
    image: "images/sapphire-pendant.svg",
    material: "18K white gold",
    stone: "Royal blue sapphire",
    weight: "11g",
    craftsmanship: "Classic prong framing"
  },
  {
    id: 6,
    name: "Emerald Ring",
    price: 1340,
    description: "A vivid emerald statement ring for special moments.",
    image: "images/emerald-ring.svg",
    material: "Platinum",
    stone: "Colombian emerald",
    weight: "7g",
    craftsmanship: "Hand-carved gallery setting"
  }
];

const page = document.body.dataset.page;

const formatPrice = (value) => `$${value.toLocaleString()}`;

function goTo(url) {
  document.body.classList.add("fade-page");
  window.location.href = url;
}

function getProductById() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  return products.find((product) => product.id === id) || products[0];
}

function renderHomePage() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = products
    .map(
      (product) => `
      <article class="product-card" data-id="${product.id}" tabindex="0" role="button" aria-label="View ${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="product-card-content">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <button class="btn" type="button">View Details</button>
        </div>
      </article>`
    )
    .join("");

  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".product-card");
    if (!card) return;
    goTo(`product.html?id=${card.dataset.id}`);
  });

  grid.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".product-card");
    if (!card) return;
    event.preventDefault();
    goTo(`product.html?id=${card.dataset.id}`);
  });
}

function renderProductPage() {
  const root = document.getElementById("productDetail");
  if (!root) return;
  const product = getProductById();

  root.innerHTML = `
    <article class="product-layout">
      <img class="card" src="${product.image}" alt="${product.name}" />
      <div class="product-info card">
        <h1>${product.name}</h1>
        <p class="price">${formatPrice(product.price)}</p>
        <p>${product.description}</p>
        <ul class="product-meta">
          <li><strong>Material:</strong> ${product.material}</li>
          <li><strong>Stone type:</strong> ${product.stone}</li>
          <li><strong>Weight:</strong> ${product.weight}</li>
          <li><strong>Craftsmanship:</strong> ${product.craftsmanship}</li>
        </ul>
        <div class="actions">
          <button class="btn" id="buyNowBtn" type="button">Buy Now</button>
          <button class="btn alt" id="backBtn" type="button">Back to Collection</button>
        </div>
      </div>
    </article>
  `;

  document.getElementById("buyNowBtn").addEventListener("click", () => {
    goTo(`payment.html?id=${product.id}`);
  });

  document.getElementById("backBtn").addEventListener("click", () => {
    goTo("index.html#collections");
  });
}

function renderPaymentPage() {
  const summary = document.getElementById("orderSummary");
  const form = document.getElementById("paymentForm");
  const message = document.getElementById("formMessage");
  if (!summary || !form || !message) return;

  const product = getProductById();

  summary.innerHTML = `
    <h2>Order Summary</h2>
    <img src="${product.image}" alt="${product.name}" />
    <h3>${product.name}</h3>
    <p class="price">${formatPrice(product.price)}</p>
    <label class="quantity">
      Quantity
      <input id="quantity" type="number" min="1" value="1" />
    </label>
    <p id="totalPrice"><strong>Total:</strong> ${formatPrice(product.price)}</p>
  `;

  const quantityInput = document.getElementById("quantity");
  const totalPrice = document.getElementById("totalPrice");

  quantityInput.addEventListener("input", () => {
    const quantity = Math.max(1, Number(quantityInput.value) || 1);
    quantityInput.value = quantity;
    totalPrice.innerHTML = `<strong>Total:</strong> ${formatPrice(quantity * product.price)}`;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const cardNumber = document.getElementById("cardNumber").value.replace(/\s+/g, "");
    const expiry = document.getElementById("expiry").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const cardValid = /^\d{13,19}$/.test(cardNumber);
    const expiryValid = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry);
    const cvvValid = /^\d{3,4}$/.test(cvv);

    if (!fullName || !emailValid || !address || !cardValid || !expiryValid || !cvvValid) {
      message.textContent = "Please check your details and complete all fields correctly.";
      message.style.color = "#9f2f2f";
      return;
    }

    message.textContent = "Thank you for your purchase.";
    message.style.color = "#2f6a3e";
    form.reset();
    quantityInput.value = 1;
    totalPrice.innerHTML = `<strong>Total:</strong> ${formatPrice(product.price)}`;
  });
}

if (page === "home") renderHomePage();
if (page === "product") renderProductPage();
if (page === "payment") renderPaymentPage();
