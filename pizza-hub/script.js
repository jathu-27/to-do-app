const pizzaMenu = [
    {
        id: 1,
        name: "Margherita",
        description: "Classic pizza with tomato, mozzarella, and fresh basil",
        price: 3500.00,
        image: "images/Margherita-Pizza-_EXPS_TOHVP24_275515_MF_02_28_1.jpg"
    },
    {
        id: 2,
        name: "Pepperoni Paradise",
        description: "Loaded with crispy pepperoni and melted cheese",
        price: 2800.00,
        image: "images/pepperonistyle.webp"
    },
    {
        id: 3,
        name: "Veggie Supreme",
        description: "Packed with bell peppers, mushrooms, olives, and onions",
        price: 1800.00,
        image: "images/veggie-pizza-side-view-out-of-oven-720x480.png"
    },
    {
        id: 4,
        name: "Meat Lovers",
        description: "Sausage, bacon, ham, and pepperoni - a carnivore's dream",
        price: 2500.00,
        image: "images/1721082146_b51ab81c02.jpg"
    },
    {
        id: 5,
        name: "BBQ Chicken",
        description: "Tender chicken, red onions, cilantro, and BBQ sauce",
        price: 3900.00,
        image: "images/BBQ-chicken-pizza-1-of-1.jpg"
    },
    {
        id: 6,
        name: "Hawaiian Sunset",
        description: "Pineapple, ham, and caramelized onions on a crispy crust",
        price: 3100.00,
        image: "images/Hawaiian-Deluxe-Pizza-600x600.jpg"
    }
];

let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    displayPizzaMenu();
    setupEventListeners();
    loadCartFromLocalStorage();
    updateCartCount();
});

function displayPizzaMenu() {
    const pizzaGrid = document.getElementById('pizzaGrid');

    pizzaGrid.innerHTML = '';
    
 
    pizzaMenu.forEach(pizza => {
        const pizzaCard = document.createElement('div');
        pizzaCard.className = 'pizza-card';
        pizzaCard.innerHTML = `
            <img src="${pizza.image}" alt="${pizza.name}" class="pizza-image">
            <div class="pizza-info">
                <h3 class="pizza-name">${pizza.name}</h3>
                <p class="pizza-description">${pizza.description}</p>
                <div class="pizza-footer">
                    <span class="pizza-price">$${pizza.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${pizza.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        pizzaGrid.appendChild(pizzaCard);
    });
}

// ========================================
// CART FUNCTIONS
// ========================================

/**
 * Adds a pizza to the cart
 * @param {number} pizzaId - The ID of the pizza to add
 */
function addToCart(pizzaId) {
    // Find the pizza in the menu
    const pizza = pizzaMenu.find(p => p.id === pizzaId);
    
    if (!pizza) return;
    
    const existingItem = cart.find(item => item.id === pizzaId);
    
    if (existingItem) {

        existingItem.quantity++;
    } else {
  
        cart.push({
            id: pizza.id,
            name: pizza.name,
            price: pizza.price,
            quantity: 1
        });
    }
    

    updateCart();
    showNotification(`${pizza.name} added to cart!`);
}

/**
 * Removes an item from the cart
 * @param {number} pizzaId - The ID of the pizza to remove
 */
function removeFromCart(pizzaId) {
    // Find index of item in cart
    const index = cart.findIndex(item => item.id === pizzaId);
    
    if (index > -1) {
        // Remove the item from cart array
        cart.splice(index, 1);
        updateCart();
    }
}

/**
 * Updates the quantity of an item in the cart
 * @param {number} pizzaId - The ID of the pizza
 * @param {number} newQuantity - The new quantity
 */
function updateQuantity(pizzaId, newQuantity) {
    // Validate quantity is positive
    if (newQuantity <= 0) {
        removeFromCart(pizzaId);
        return;
    }
    
    // Find and update the item
    const item = cart.find(item => item.id === pizzaId);
    if (item) {
        item.quantity = newQuantity;
        updateCart();
    }
}

/**
 * Updates the cart display and totals
 * Saves cart to localStorage and updates UI elements
 */
function updateCart() {
    // Save cart to local storage
    saveCartToLocalStorage();
    
    // Update cart count badge
    updateCartCount();
    
    // Update modal display if it's open
    if (document.getElementById('cartModal').classList.contains('show')) {
        displayCartItems();
    }
}

/**
 * Updates the cart count badge in the navbar
 */
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

/**
 * Displays cart items in the modal
 * Shows each item with quantity controls and remove button
 */
function displayCartItems() {
    const cartItemsDiv = document.getElementById('cartItems');
    const emptyCartMsg = document.getElementById('emptyCartMessage');
    
    // Clear existing content
    cartItemsDiv.innerHTML = '';
    
    if (cart.length === 0) {
        // Show empty cart message
        emptyCartMsg.classList.add('show');
        document.querySelector('.cart-summary').style.display = 'none';
        return;
    }
    
    // Hide empty message
    emptyCartMsg.classList.remove('show');
    document.querySelector('.cart-summary').style.display = 'block';
    
    // Display each cart item
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <div>
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                <button class="btn btn-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsDiv.appendChild(cartItem);
    });
    
    // Update total price
    updateTotalPrice();
}

/**
 * Calculates and displays the total price of items in cart
 */
function updateTotalPrice() {
    const totalPrice = document.getElementById('totalPrice');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = total.toFixed(2);
}

/**
 * Saves cart to browser's localStorage for persistence
 */
function saveCartToLocalStorage() {
    localStorage.setItem('pizzaHubCart', JSON.stringify(cart));
}

/**
 * Loads cart from browser's localStorage
 */
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('pizzaHubCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// ========================================
// MODAL / CART DISPLAY
// ========================================

/**
 * Opens the cart modal window
 */
function openCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.add('show');
    displayCartItems();
}

/**
 * Closes the cart modal window
 */
function closeCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('show');
}

// ========================================
// EVENT LISTENERS SETUP
// ========================================

/**
 * Sets up all event listeners for the page
 */
function setupEventListeners() {
    // Cart button to open modal
    document.getElementById('cartBtn').addEventListener('click', openCart);
    
    // Close button in modal
    document.querySelector('.close').addEventListener('click', closeCart);
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('cartModal');
        if (event.target === modal) {
            closeCart();
        }
    });
    
    // Contact form submission
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);
    
    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
}

// ========================================
// CONTACT FORM HANDLING
// ========================================

/**
 * Handles contact form submission
 * @param {Event} event - The form submission event
 */
function handleContactForm(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Validate form (basic validation)
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show success message
    showNotification(`Thank you, ${name}! We'll get back to you soon.`);
    
    // Reset form
    document.getElementById('contactForm').reset();
}

// ========================================
// CHECKOUT FUNCTION
// ========================================

/**
 * Handles the checkout process
 */
function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Show checkout message
    showNotification(`Order placed! Total: $${total.toFixed(2)}. Thank you for your purchase!`);
    
    // Clear the cart
    cart = [];
    updateCart();
    
    // Close modal
    closeCart();
    
    // Clear localStorage
    localStorage.removeItem('pizzaHubCart');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Shows a temporary notification message to the user
 * @param {string} message - The message to display
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation
    const style = document.createElement('style');
    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}