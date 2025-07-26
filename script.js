document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
        });
    });

    // Cart functionality
    const cartButton = document.getElementById('cart-button');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartContent = document.querySelector('.cart-content');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.querySelector('.cart-count');
    const notification = document.getElementById('notification');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Product data
    const products = [
        {
            id: 1,
            title: "Classic White T-Shirt",
            price: 19.99,
            description: "Comfortable 100% cotton white t-shirt for everyday wear.",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "Slim Fit Jeans",
            price: 49.99,
            description: "Stylish slim fit jeans with stretch for maximum comfort.",
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            title: "Casual Blazer",
            price: 89.99,
            description: "Perfect for both office and casual outings.",
            image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 4,
            title: "Summer Dress",
            price: 39.99,
            description: "Light and airy dress perfect for summer days.",
            image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 5,
            title: "Sports Hoodie",
            price: 34.99,
            description: "Warm and comfortable hoodie for sports and casual wear.",
            image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 6,
            title: "Formal Shirt",
            price: 29.99,
            description: "Crisp formal shirt for business and special occasions.",
            image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 7,
            title: "Winter Jacket",
            price: 99.99,
            description: "Warm winter jacket with waterproof exterior.",
            image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 8,
            title: "Casual Sneakers",
            price: 59.99,
            description: "Comfortable sneakers for everyday use.",
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        }
    ];

    // Display products
    const productGrid = document.querySelector('.product-grid');
    
    function displayProducts() {
        productGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-description">${product.description}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    displayProducts();

    // Add to cart functionality
    productGrid.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(item => item.id === productId);
            
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            updateCart();
            showNotification(`${product.title} added to cart`);
        }
    });

    // Update cart
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }

    // Render cart items
    function renderCart() {
        cartContent.innerHTML = '';
        
        if (cart.length === 0) {
            cartContent.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)} ($${item.price.toFixed(2)} × ${item.quantity})</p>
                    <button class="cart-item-remove" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartContent.appendChild(cartItem);
            
            total += item.price * item.quantity;
        });
        
        cartTotal.textContent = total.toFixed(2);
    }

    // Update cart count
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
    }

    // Remove item from cart
    cartContent.addEventListener('click', function(e) {
        if (e.target.classList.contains('cart-item-remove')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            cart = cart.filter(item => item.id !== productId);
            updateCart();
            showNotification('Item removed from cart');
        }
    });

    // Show notification
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Toggle cart
    cartButton.addEventListener('click', function(e) {
        e.preventDefault();
        cartOverlay.style.display = 'flex';
    });

    closeCart.addEventListener('click', function() {
        cartOverlay.style.display = 'none';
    });

    // Close cart when clicking outside
    cartOverlay.addEventListener('click', function(e) {
        if (e.target === cartOverlay) {
            cartOverlay.style.display = 'none';
        }
    });

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty');
            return;
        }
        
        // In a real implementation, this would redirect to a checkout page
        // Here we'll simulate a Google Form submission
        
        // Create a form with all cart items
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'; // Replace with your actual Google Form URL
        form.target = '_blank';
        form.style.display = 'none';
        
        // Add customer info (you would collect this in a real implementation)
        const nameInput = document.createElement('input');
        nameInput.type = 'hidden';
        nameInput.name = 'entry.2005620554'; // Replace with your actual field name
        nameInput.value = 'Customer Name';
        form.appendChild(nameInput);
        
        const emailInput = document.createElement('input');
        emailInput.type = 'hidden';
        emailInput.name = 'entry.1045781291'; // Replace with your actual field name
        emailInput.value = 'customer@example.com';
        form.appendChild(emailInput);
        
        // Add cart items
        const items = cart.map(item => `${item.title} (${item.quantity} × $${item.price.toFixed(2)})`).join('\n');
        const itemsInput = document.createElement('input');
        itemsInput.type = 'hidden';
        itemsInput.name = 'entry.1065046570'; // Replace with your actual field name
        itemsInput.value = items;
        form.appendChild(itemsInput);
        
        // Add total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalInput = document.createElement('input');
        totalInput.type = 'hidden';
        totalInput.name = 'entry.1166974658'; // Replace with your actual field name
        totalInput.value = `$${total.toFixed(2)}`;
        form.appendChild(totalInput);
        
        document.body.appendChild(form);
        form.submit();
        
        // Clear cart after checkout
        cart = [];
        updateCart();
        showNotification('Order submitted successfully!');
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real implementation, this would send the form data to a server
        // Here we'll simulate a Google Form submission
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Create a form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'; // Replace with your actual Google Form URL
        form.target = '_blank';
        form.style.display = 'none';
        
        // Add form fields (replace with your actual Google Form field names)
        const nameInput = document.createElement('input');
        nameInput.type = 'hidden';
        nameInput.name = 'entry.2005620554'; // Replace with your actual field name
        nameInput.value = name;
        form.appendChild(nameInput);
        
        const emailInput = document.createElement('input');
        emailInput.type = 'hidden';
        emailInput.name = 'entry.1045781291'; // Replace with your actual field name
        emailInput.value = email;
        form.appendChild(emailInput);
        
        const messageInput = document.createElement('input');
        messageInput.type = 'hidden';
        messageInput.name = 'entry.839337160'; // Replace with your actual field name
        messageInput.value = message;
        form.appendChild(messageInput);
        
        document.body.appendChild(form);
        form.submit();
        
        // Show success message
        showNotification('Message sent successfully!');
        contactForm.reset();
    });

    // Initialize cart on page load
    updateCartCount();
    renderCart();
});