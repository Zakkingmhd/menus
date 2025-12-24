const MENU_URL = "https://opensheet.elk.sh/1Nl9H971-1sDglNflUcB4NsdWxTc6YrpoYd0kwPL-0I8/Kaymas%20menu";
const WHATSAPP_NUMBER = "919744103674"; // Eazeo number

let cart = {};
let categories = [];

fetch(MENU_URL)
  .then(res => res.json())
  .then(data => initMenu(data));

function initMenu(items) {
  categories = [...new Set(items.map(i => i.Category))];
  renderTabs();
  renderItems(items);
}

function renderTabs() {
  const tabs = document.getElementById("category-tabs");
  categories.forEach((cat, i) => {
    const div = document.createElement("div");
    div.className = "tab" + (i === 0 ? " active" : "");
    div.innerText = cat;
    div.onclick = () => scrollToCategory(cat);
    tabs.appendChild(div);
  });
}

function renderItems(items) {
  const menu = document.getElementById("menu");
  let currentCategory = "";

  items.forEach(item => {
    if (item.Status !== "Available") return;

    if (item.Category !== currentCategory) {
      currentCategory = item.Category;
      const title = document.createElement("div");
      title.className = "category-title";
      title.id = currentCategory;
      title.innerText = currentCategory;
      menu.appendChild(title);
    }

    const prices = {
      Full: item["Price (Full)"],
      Half: item["Price (Half)"],
      Quarter: item["Price (Quarter)"]
    };

    const card = document.createElement("div");
    card.className = "item-card";

    card.innerHTML = `
      <div class="item-info">
        <h3>${item.Item}</h3>
        <div class="price-options">
          ${Object.entries(prices).filter(([_,v])=>v).map(
            ([k,v]) => `<span class="price-btn" onclick="selectSize('${item.Item}','${k}','${v}', this)">${k} ${v}</span>`
          ).join("")}
        </div>
      </div>
      <div class="controls">
        <button onclick="changeQty('${item.Item}', -1)">−</button>
        <span id="qty-${item.Item}">0</span>
        <button onclick="changeQty('${item.Item}', 1)">+</button>
      </div>
    `;

    menu.appendChild(card);
  });
}

function scrollToCategory(cat) {
  document.getElementById(cat).scrollIntoView({behavior:"smooth"});
}

function selectSize(item, size, price, el) {
  cart[item] = cart[item] || { qty: 0 };
  cart[item].size = size;
  cart[item].price = price;

  el.parentElement.querySelectorAll(".price-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
}

function changeQty(item, delta) {
  if (!cart[item] || !cart[item].size) {
    alert("Select size first");
    return;
  }
  cart[item].qty += delta;
  if (cart[item].qty <= 0) delete cart[item];

  document.getElementById(`qty-${item}`).innerText = cart[item]?.qty || 0;
  updateCart();
}

function updateCart() {
  const total = Object.values(cart).reduce((a,b)=>a+b.qty,0);
  const bar = document.getElementById("cart-bar");
  document.getElementById("cart-summary").innerText = `${total} items`;
  bar.classList.toggle("hidden", total === 0);
}

function orderNow() {
  let msg = "Order from Kaymas Restaurant%0A";
  Object.entries(cart).forEach(([i,d])=>{
    msg += `${d.qty} x ${i} (${d.size}) ${d.price}%0A`;
  });
  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}
