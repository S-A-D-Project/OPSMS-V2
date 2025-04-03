// Sample product data
const products = [
    {
        id: 1,
        name: "Business Cards",
        category: "documents",
        price: 1499.99,
        description: "Professional business cards with premium quality paper",
        image: "images/products/business-cards.jpg"
    },
    {
        id: 2,
        name: "Photo Prints",
        category: "photos",
        price: 499.99,
        description: "High-quality photo prints in various sizes",
        image: "images/products/photo-prints.jpg"
    },
    {
        id: 3,
        name: "Custom T-Shirts",
        category: "merchandise",
        price: 1249.99,
        description: "Personalized t-shirts with your design",
        image: "images/products/t-shirts.jpg"
    },
    {
        id: 4,
        name: "Banners",
        category: "documents",
        price: 2499.99,
        description: "Large format banners for events and advertising",
        image: "images/products/banners.jpg"
    }
];

// Cart functionality
let cart = [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        showNotification('Product added to cart!');
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Product filtering
function filterProducts(category) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';

    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);

    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p class="price">₱${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})" class="add-to-cart">Add to Cart</button>
    `;
    return card;
}

// Order tracking
function trackOrder() {
    const orderId = document.getElementById('orderId').value;
    const trackingResult = document.getElementById('trackingResult');
    
    if (!orderId) {
        trackingResult.innerHTML = '<p class="error">Please enter an order ID</p>';
        return;
    }

    // Simulate API call
    trackingResult.innerHTML = '<p>Tracking order...</p>';
    
    setTimeout(() => {
        trackingResult.innerHTML = `
            <div class="tracking-status">
                <h3>Order #${orderId}</h3>
                <p>Status: In Processing</p>
                <p>Estimated Delivery: 3-5 business days</p>
            </div>
        `;
    }, 1500);
}

// Contact form
function handleContactForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Simulate form submission
    showNotification('Message sent successfully!');
    form.reset();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize product grid
    filterProducts('all');

    // Add event listeners
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProducts(button.dataset.category);
        });
    });

    document.querySelector('.track-btn').addEventListener('click', trackOrder);
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);

    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 