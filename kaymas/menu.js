const MENU_URL = "https://opensheet.elk.sh/1Nl9H971-1sDglNflUcB4NsdWxTc6YrpoYd0kwPL-0I8/Kaymas%20menu";
const WHATSAPP_NUMBER = "919744103674"; // Eazeo number

let cart = {};
let currentCategory = "";

fetch(MENU_URL)
  .then(res => res.json())
  .then(data => renderMenu(data));

function renderMenu(items) {
  const menu = document.getElementById("menu");

  items.forEach(item => {
    if (item.Status !== "Available") return;

    if (item.Category !== currentCategory) {
      currentCategory = item.Category;
      const cat = document.createElement("div");
      cat.className = "category";
      cat.innerText = currentCategory;
      menu.appendChild(cat);
    }

    const card = document.createElement("div");
    card.className = "card";

    const prices = {
      Full: item["Price (Full)"],
      Half: item["Price (Half)"],
      Quarter: item["Price (Quarter)"]
    };

    const priceButtons = Object.entries(prices)
      .filter(([_, v]) => v)
      .map(([k, v]) =>
        `<div class="price-btn" onclick="selectSize('${item.Item}','${k}','${v}')">${k} ${v}</div>`
      ).join("");

    card.innerHTML = `
      <h3>${item.Item}</h3>
      <div class="price-row">${priceButtons}</div>
      <div class="qty">
        <button onclick="changeQty('${item.Item}',-1)">−</button>
        <span id="qty-${item.Item}">0</span>
        <button onclick="changeQty('${item.Item}',1)">+</button>
      </div>
    `;

    menu.appendChild(card);
  });
}

function selectSize(item, size, price) {
  cart[item] = cart[item] || { qty: 0 };
  cart[item].size = size;
  cart[item].price = price;

  document.querySelectorAll(`.price-btn`).forEach(b => b.classList.remove("active"));
  event.target.classList.add("active");
}

function changeQty(item, delta) {
  if (!cart[item] || !cart[item].size) {
    alert("Please select size first");
    return;
  }

  cart[item].qty += delta;
  if (cart[item].qty <= 0) delete cart[item];

  document.getElementById(`qty-${item}`).innerText = cart[item]?.qty || 0;
  updateCartCount();
}

function updateCartCount() {
  const count = Object.values(cart).reduce((a, b) => a + b.qty, 0);
  document.getElementById("cart-count").innerText = `${count} items`;
}

function orderNow() {
  if (Object.keys(cart).length === 0) return alert("Cart is empty");

  let message = "Order from Kaymas Restaurant%0A";

  Object.entries(cart).forEach(([item, d]) => {
    message += `${d.qty} x ${item} (${d.size}) ${d.price}%0A`;
  });

  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
