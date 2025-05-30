// Global error handler for debugging server issues
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
    console.error('Error details:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack
    });
});

// Debug environment information
console.log('=== ENVIRONMENT DEBUG INFO ===');
console.log('Protocol:', window.location.protocol);
console.log('Host:', window.location.host);
console.log('Pathname:', window.location.pathname);
console.log('User Agent:', navigator.userAgent);
console.log('Document ready state:', document.readyState);
console.log('=== END DEBUG INFO ===');

// Test function for debugging button clicks
function testButtonClick(buttonName) {
    console.log(`${buttonName} button clicked!`);
    showNotification(`${buttonName} button clicked!`, 'info');
    
    // Call the actual function based on button type
    if (buttonName.includes('WhatsApp')) {
        openWhatsAppModal();
    } else if (buttonName.includes('GoFood')) {
        redirectToGoFood();
    }
}

// Make test function globally accessible
window.testButtonClick = testButtonClick;

// Products data
const products = [
    {
        id: 1,
        name: "Kebuli Ayam Krispi",
        price: 12000,
        image: "produk/produk-1/kebuli ayam krispi harga 12.000.jpg",
        description: "Nasi kebuli dengan ayam krispi yang renyah dan bumbu khas Ajibarang",
        category: "kebuli"
    },
    {
        id: 2,
        name: "Kebuli Ayam Original",
        price: 12000,
        image: "produk/produk-2/kebuli ayam ori harga 12.000.jpg",
        description: "Nasi kebuli tradisional dengan ayam bumbu rempah pilihan",
        category: "kebuli"
    },
    {
        id: 3,
        name: "Kebuli Telur Ayam Krispi",
        price: 12000,
        image: "produk/produk-3/kebuli telur ayam krispi harga 12.000.jpg",
        description: "Nasi kebuli dengan telur dan ayam krispi yang menggugah selera",
        category: "kebuli"
    },
    {
        id: 4,
        name: "Kebuli Ayam Katsu",
        price: 12000,
        image: "produk/produk-4/kebuli ayam katsu harga 12.000.jpg",
        description: "Nasi kebuli dengan ayam katsu crispy dan saus spesial",
        category: "kebuli"
    },
    {
        id: 5,
        name: "Kebuli Ayam Geprek",
        price: 12000,
        image: "produk/produk-5/kebuli ayam geprek harga 12.000.jpg",
        description: "Nasi kebuli dengan ayam geprek pedas dan sambal matah",
        category: "kebuli"
    },
    {
        id: 6,
        name: "Briyani Ayam Goreng",
        price: 15000,
        image: "produk/produk-6/briyani ayam goreng harga 15.000.jpg",
        description: "Nasi briyani dengan ayam goreng dan rempah khas India",
        category: "briyani"
    }
];

// Cart functionality
let cart = [];
let filteredProducts = [...products];
const whatsappNumber = "6283822457915"; // Indonesian format

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartFooter = document.getElementById('cartFooter');
const sortSelect = document.getElementById('sortSelect');
const filterSelect = document.getElementById('filterSelect');

// CHECKOUT FUNCTIONS - DEFINED EARLY
// Direct redirect to GoFood
function redirectToGoFood() {
    console.log('redirectToGoFood function called');
    console.log('Current environment:', window.location.protocol, window.location.host);
    
    try {
        if (cart.length === 0) {
            console.log('Cart is empty');
            showNotification('Keranjang masih kosong!', 'error');
            return;
        }
        
        // GoFood restaurant link
        const gofoodUrl = 'https://gofood.co.id/purwokerto/restaurant/kebuli-ajb-ump-jl-tegalsari-dukuhwaluh-3e9f6eea-3a96-41e6-8676-d1fddde26058';
        
        console.log('Clearing cart and redirecting to:', gofoodUrl);
        
        // Clear cart and redirect
        cart = [];
        updateCartUI();
        saveCartToStorage();
        toggleCart();
        
        // Direct redirect to GoFood
        const opened = window.open(gofoodUrl, '_blank');
        if (opened) {
            console.log('Window opened successfully');
            showNotification('Mengarahkan ke GoFood...', 'info');
        } else {
            console.error('Failed to open window - popup blocked?');
            showNotification('Popup diblokir! Silakan aktifkan popup untuk situs ini.', 'error');
            // Fallback: try direct redirect
            window.location.href = gofoodUrl;
        }
    } catch (error) {
        console.error('Error in redirectToGoFood:', error);
        showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
    }
}

// Open WhatsApp Modal
function openWhatsAppModal() {
    console.log('openWhatsAppModal function called');
    console.log('Current environment:', window.location.protocol, window.location.host);
    
    try {
        if (cart.length === 0) {
            console.log('Cart is empty');
            showNotification('Keranjang masih kosong!', 'error');
            return;
        }
        
        const modal = document.getElementById('whatsappModal');
        console.log('Modal element found:', !!modal);
        
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('WhatsApp modal opened successfully');
            console.log('Modal classes:', modal.className);
        } else {
            console.error('WhatsApp modal element not found in DOM');
            // Fallback: direct WhatsApp redirect
            console.log('Attempting fallback direct WhatsApp redirect');
            sendToWhatsAppDirect();
        }
    } catch (error) {
        console.error('Error in openWhatsAppModal:', error);
        showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
    }
}

// Close WhatsApp Modal
function closeWhatsAppModal() {
    console.log('closeWhatsAppModal function called');
    
    const modal = document.getElementById('whatsappModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Clear form
        const nameField = document.getElementById('modalName');
        const addressField = document.getElementById('modalAddress');
        if (nameField) nameField.value = '';
        if (addressField) addressField.value = '';
        
        console.log('WhatsApp modal closed');
    }
}

// Send to WhatsApp from Modal
function sendToWhatsApp() {
    console.log('sendToWhatsApp function called');
    
    const nameField = document.getElementById('modalName');
    const addressField = document.getElementById('modalAddress');
    
    if (!nameField || !addressField) {
        console.error('Form fields not found');
        showNotification('Error: Form tidak ditemukan!', 'error');
        return;
    }
    
    const name = nameField.value.trim();
    const address = addressField.value.trim();
    
    if (!name) {
        showNotification('Nama harus diisi!', 'error');
        return;
    }
    
    if (!address) {
        showNotification('Alamat harus diisi!', 'error');
        return;
    }
    
    let message = "🍛 *Pesanan Nasi Kebuli Ajibarang*\n\n";
    message += "👤 *Info Pelanggan:*\n";
    message += `Nama: ${name}\n`;
    message += `Alamat: ${address}\n\n`;
    
    message += "📦 *Detail Pesanan:*\n";
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `📌 ${item.name}\n`;
        message += `   Jumlah: ${item.quantity} porsi\n`;
        message += `   Harga: Rp ${formatPrice(item.price)}\n`;
        message += `   Subtotal: Rp ${formatPrice(itemTotal)}\n\n`;
        total += itemTotal;
    });
    
    message += `💰 *Total: Rp ${formatPrice(total)}*\n\n`;
    message += "📝 Mohon konfirmasi pesanan ini.\n";
    message += " Lokasi: Stand UMP, Ajibarang\n";
    message += "🕒 Jam operasional: 08:00 - 20:00\n\n";
    message += "Terima kasih! 🙏";
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    console.log('Sending to WhatsApp:', whatsappUrl);
    
    // Clear cart and close modal
    cart = [];
    updateCartUI();
    saveCartToStorage();
    toggleCart();
    closeWhatsAppModal();
    
    // Direct redirect
    window.open(whatsappUrl, '_blank');
    showNotification('Pesanan berhasil dikirim ke WhatsApp!', 'success');
}

// Make functions globally accessible IMMEDIATELY
window.openWhatsAppModal = openWhatsAppModal;
window.closeWhatsAppModal = closeWhatsAppModal;
window.sendToWhatsApp = sendToWhatsApp;
window.redirectToGoFood = redirectToGoFood;

console.log('Checkout functions loaded and available globally:', {
    openWhatsAppModal: typeof window.openWhatsAppModal,
    redirectToGoFood: typeof window.redirectToGoFood,
    closeWhatsAppModal: typeof window.closeWhatsAppModal,
    sendToWhatsApp: typeof window.sendToWhatsApp
});

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    renderProducts(filteredProducts);
    addProductAnimation();
    handleModalOverlayClicks();
});

// Render products
function renderProducts(productsToRender = filteredProducts) {
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3 style="color: #666;">Tidak ada produk yang sesuai</h3>
                <p style="color: #999;">Coba ubah filter atau pencarian Anda</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-category="${product.category}" data-price="${product.price}">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDMyMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIyODAiIGZpbGw9IiNmOGY5ZmEiLz48cGF0aCBkPSJNMTMwIDEyMEMxMzAgMTE2LjY4NiAxMzIuNjg2IDExNCAxMzYgMTE0SDE4NEMxODcuMzE0IDExNCAxOTAgMTE2LjY4NiAxOTAgMTIwVjE0MEMxOTAgMTQzLjMxNCAxODcuMzE0IDE0NiAxODQgMTQ2SDEzNkMxMzIuNjg2IDE0NiAxMzAgMTQzLjMxNCAxMzAgMTQwVjEyMFoiIGZpbGw9IiNlMGUwZTAiLz48cGF0aCBkPSJNMTQwIDEzMEMxNDAgMTI3LjIzOSAxNDIuMjM5IDEyNSAxNDUgMTI1SDE3NUMxNzcuNzYxIDEyNSAxODAgMTI3LjIzOSAxODAgMTMwQzE4MCAxMzIuNzYxIDE3Ny43NjEgMTM1IDE3NSAxMzVIMTQ1QzE0Mi4yMzkgMTM1IDE0MCAxMzIuNzYxIDE0MCAxMzBaIiBmaWxsPSIjYzBjMGMwIi8+PC9zdmc+'">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">Rp ${formatPrice(product.price)}</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i>
                    Tambah ke Keranjang
                </button>
            </div>
        </div>
    `).join('');
}

// Sort products
function sortProducts() {
    const sortValue = sortSelect.value;
    let sortedProducts = [...filteredProducts];
    
    switch(sortValue) {
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            // Keep original order
            break;
    }
    
    renderProducts(sortedProducts);
    addProductAnimation();
}

// Filter products
function filterProducts() {
    const filterValue = filterSelect.value;
    
    switch(filterValue) {
        case 'all':
            filteredProducts = [...products];
            break;
        case 'kebuli':
            filteredProducts = products.filter(product => product.category === 'kebuli');
            break;
        case 'briyani':
            filteredProducts = products.filter(product => product.category === 'briyani');
            break;
        case '12000':
            filteredProducts = products.filter(product => product.price === 12000);
            break;
        case '15000':
            filteredProducts = products.filter(product => product.price === 15000);
            break;
        default:
            filteredProducts = [...products];
            break;
    }
    
    // Reset sort when filtering
    sortSelect.value = 'default';
    renderProducts(filteredProducts);
    addProductAnimation();
}

// Add animation to products
function addProductAnimation() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showCartNotification(product.name);
    saveCartToStorage();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCartToStorage();
        }
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Show/hide cart count
    if (totalItems > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = formatPrice(total);
    
    // Render cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Keranjang masih kosong</p>
                <small>Tambahkan produk untuk mulai berbelanja</small>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiNmOGY5ZmEiLz48L3N2Zz4='">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">Rp ${formatPrice(item.price)}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span style="margin: 0 10px; font-weight: 600; min-width: 20px; text-align: center;">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="qty-btn" onclick="removeFromCart(${item.id})" style="background: #e74c3c; margin-left: 10px;" title="Hapus item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        cartFooter.style.display = 'block';
        
        // Update cart footer with checkout buttons
        cartFooter.innerHTML = `
            <div class="cart-total">
                <h4>Total: Rp ${formatPrice(total)}</h4>
            </div>
            <div class="checkout-buttons">
                <div class="btn-checkout whatsapp" id="whatsappButton" onclick="testButtonClick('Dynamic WhatsApp')">
                    <i class="fab fa-whatsapp"></i> Pesan via WhatsApp
                </div>
                <div class="btn-checkout gofood" id="gofoodButton" onclick="testButtonClick('Dynamic GoFood')">
                    Pesan via GoFood
                </div>
            </div>
        `;
        
        console.log('Cart footer updated with test buttons');
    }
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : 'auto';
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    let bgColor, icon;
    
    switch(type) {
        case 'error':
            bgColor = '#e74c3c';
            icon = 'fas fa-exclamation-triangle';
            break;
        case 'info':
            bgColor = '#3498db';
            icon = 'fas fa-info-circle';
            break;
        default:
            bgColor = '#2c5530';
            icon = 'fas fa-check-circle';
            break;
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        z-index: 1002;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        transform: translateX(400px);
        transition: transform 0.3s;
        max-width: 300px;
        word-wrap: break-word;
        font-size: 0.9rem;
        line-height: 1.4;
    `;
    notification.innerHTML = `
        <i class="${icon}" style="margin-right: 10px;"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-close after longer time for info messages
    const closeTime = type === 'info' ? 5000 : 3000;
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, closeTime);
}

// Show cart notification
function showCartNotification(productName) {
    showNotification(`${productName} ditambahkan ke keranjang!`, 'success');
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('nasiKebuliCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('nasiKebuliCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Handle clicks outside cart to close it
document.addEventListener('click', function(e) {
    if (!cartSidebar.contains(e.target) && !e.target.closest('.cart-btn')) {
        if (cartSidebar.classList.contains('active')) {
            toggleCart();
        }
    }
});

// Handle escape key to close cart
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
        toggleCart();
    }
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const headerHeight = 80;
    const sectionTop = section.offsetTop - headerHeight;
    
    window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
    });
}

// Initialize smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Add modal click handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle modal overlay clicks
    const modalOverlay = document.getElementById('whatsappModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeWhatsAppModal();
            }
        });
    }
    
    console.log('DOM ready, modal handlers set');
});

// Format price helper
function formatPrice(price) {
    return price.toLocaleString('id-ID');
}

// Fallback function for direct WhatsApp redirect
function sendToWhatsAppDirect() {
    try {
        let message = "🍛 *Pesanan Nasi Kebuli Ajibarang*\n\n";
        message += "📦 *Detail Pesanan:*\n";
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            message += `📌 ${item.name}\n`;
            message += `   Jumlah: ${item.quantity} porsi\n`;
            message += `   Harga: Rp ${formatPrice(item.price)}\n`;
            message += `   Subtotal: Rp ${formatPrice(itemTotal)}\n\n`;
            total += itemTotal;
        });
        
        message += `💰 *Total: Rp ${formatPrice(total)}*\n\n`;
        message += "📝 Mohon konfirmasi pesanan ini.\n";
        message += "📍 Lokasi: Stand UMP, Ajibarang\n";
        message += "🕒 Jam operasional: 08:00 - 20:00\n\n";
        message += "Terima kasih! 🙏";
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        console.log('Direct WhatsApp redirect to:', whatsappUrl);
        
        // Clear cart
        cart = [];
        updateCartUI();
        saveCartToStorage();
        toggleCart();
        
        // Try to open WhatsApp
        const opened = window.open(whatsappUrl, '_blank');
        if (opened) {
            showNotification('Pesanan berhasil dikirim ke WhatsApp!', 'success');
        } else {
            // Fallback: direct redirect
            window.location.href = whatsappUrl;
        }
    } catch (error) {
        console.error('Error in sendToWhatsAppDirect:', error);
        showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
    }
}

// Navbar Scroll Behavior - DISABLED
// The navbar now stays fixed at the top at all times (scroll hiding removed)

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const headerHeight = 80;
    const sectionTop = section.offsetTop - headerHeight;
    
    window.scrollTo({
        top: sectionTop,
        behavior: 'smooth'
    });
}

// Initialize smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Add modal click handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle modal overlay clicks
    const modalOverlay = document.getElementById('whatsappModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeWhatsAppModal();
            }
        });
    }
    
    console.log('DOM ready, modal handlers set');
});

// Format price helper
function formatPrice(price) {
    return price.toLocaleString('id-ID');
}

// Fallback function for direct WhatsApp redirect
function sendToWhatsAppDirect() {
    try {
        let message = "🍛 *Pesanan Nasi Kebuli Ajibarang*\n\n";
        message += "📦 *Detail Pesanan:*\n";
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            message += `📌 ${item.name}\n`;
            message += `   Jumlah: ${item.quantity} porsi\n`;
            message += `   Harga: Rp ${formatPrice(item.price)}\n`;
            message += `   Subtotal: Rp ${formatPrice(itemTotal)}\n\n`;
            total += itemTotal;
        });
        
        message += `💰 *Total: Rp ${formatPrice(total)}*\n\n`;
        message += "📝 Mohon konfirmasi pesanan ini.\n";
        message += "📍 Lokasi: Stand UMP, Ajibarang\n";
        message += "🕒 Jam operasional: 08:00 - 20:00\n\n";
        message += "Terima kasih! 🙏";
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        console.log('Direct WhatsApp redirect to:', whatsappUrl);
        
        // Clear cart
        cart = [];
        updateCartUI();
        saveCartToStorage();
        toggleCart();
        
        // Try to open WhatsApp
        const opened = window.open(whatsappUrl, '_blank');
        if (opened) {
            showNotification('Pesanan berhasil dikirim ke WhatsApp!', 'success');
        } else {
            // Fallback: direct redirect
            window.location.href = whatsappUrl;
        }
    } catch (error) {
        console.error('Error in sendToWhatsAppDirect:', error);
        showNotification('Terjadi kesalahan. Silakan coba lagi.', 'error');
    }
} 