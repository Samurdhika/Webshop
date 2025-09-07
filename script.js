const apiBase = 'https://fakestoreapi.com'; // API base URL

let products = []; // Store fetched products
let cart = []; // Store cart items

// Elements
const productGrid = document.getElementById('productGrid');
const categoryFilter = document.getElementById('categoryFilter');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

// Fetch products
async function fetchProducts(category = 'all') {
    const url = category === 'all' ? `${apiBase}/products` : `${apiBase}/products/category/${category}`;
    const res = await fetch(url);
    products = await res.json();
    displayProducts(products);
}

// Display products in the grid
function displayProducts(products) {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-details">
                <div class="product-name">${product.title}</div>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1; // Increment quantity
    } else {
        cart.push({ ...product, quantity: 1 }); // Add new item with quantity 1
    }
    updateCart();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId); // Remove item by ID
    updateCart();
}

// Update cart display
function updateCart() {
    cartItemsContainer.innerHTML = ''; // Clear cart content

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-product-name">${item.title}</div>
            <div class="cart-product-quantity">
                <span>${item.quantity}</span>
            </div>
            <div class="cart-product-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Update total price
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.innerText = ` $${totalPrice.toFixed(2)}`;
}

// Checkout button
document.getElementById('checkoutBtn').addEventListener('click', () => {
    alert('Order sent!');
    cart = []; // Empty the cart after checkout
    updateCart();
});

// Fetch categories
async function fetchCategories() {
    const res = await fetch(`${apiBase}/products/categories`);
    const categories = await res.json();

    // Add an "All" category button
    const allButton = document.createElement('button');
    allButton.classList.add('category-button');
    allButton.textContent = 'All';
    allButton.onclick = () => fetchProducts('all');
    categoryFilter.appendChild(allButton);

    // Add buttons for each category
    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('category-button');
        button.textContent = category;
        button.onclick = () => fetchProducts(category);
        categoryFilter.appendChild(button);
    });
}

const loginBtn = document.getElementById('loginBtn');
const welcomeMessage = document.getElementById('welcomeMessage');

loginBtn.addEventListener('click', () => {
    const username = prompt('Enter your username:');
    if (username) {
        welcomeMessage.textContent = `Welcome, ${username}!`;
        loginBtn.style.display = 'none';
    }
});


// Initialize on page load
fetchCategories();
fetchProducts();
