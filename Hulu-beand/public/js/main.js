// //Cart Open Close

let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');

// Open Cart
cartIcon.onclick = () => {
    cart.classList.add("active");   
}
// Close Cart
closeCart.onclick = () => {
    cart.classList.remove("active");
}

// Making Add to Cart Button Work
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

// Making function
function ready() {
    loadCartItems();
    updateCartIcon();
    //remove Item from Cart
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }
}
// Quantity Change
var quantityInputs = document.getElementsByClassName('cart-quantity');
for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener('change', quantityChanged);
   

}
// Add to Cart
var addToCartButtons = document.getElementsByClassName('add-cart');
for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener('click', addToCartClicked);
}
// Add to Cart Clicked
function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement;
    var title = shopItem.getElementsByClassName("product-title")[0].innerText;
    var price = shopItem.getElementsByClassName("price")[0].innerText;
    var imageSrc = shopItem.getElementsByClassName("product-img")[0].src;
    addItemToCart(title, price, imageSrc);
    updatetotal();
    saveCartItems();
    updateCartIcon();
}
// Remove Item from Cart
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
    saveCartItems();
    updateCartIcon();
}
// Quantity Change
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();
    saveCartItems();
    updateCartIcon() ;
}
// Update Cart Total
function updatetotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var quantity = quantityElement.value;
        total = total + (price * quantity);
        
        // if price contains decimal
        total = Math.round(total * 100) / 100;
    }
        document.getElementsByClassName('total-price')[0].innerText = '$' + total;
        //save total to local storage
        localStorage.setItem('total', total);
    
}
// Add Item to Cart
function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement("div");
    cartRow.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemNames = cartItems.getElementsByClassName("cart-product-title");
    for (var i = 0; i < cartItemNames.length; i++) {
        // Trim whitespace from both sides of the title before comparing
        if (cartItemNames[i].innerText.trim() === title.trim()) {
            alert('This item is already added to the cart');
            return;
        }
    }
    var cartRowContents = `
    <img src="${imageSrc}" alt="" class="cart-img">
    <div class="details-box">
        <div class="cart-product-title"> ${title} </div>
        <div class="cart-price">${price} </div>
            <input 
            type="number"
            name=""
            id=""
            value="1"
            class="cart-quantity"
            />
        </div>
        <i class='bx bx-trash-alt cart-remove'  ></i>

    `;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged);
    saveCartItems();
    updateCartIcon();
}

// keep item in cart when page is refreshed with local storage

function saveCartItems() {
    console.log("Saving cart items...");
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var cartItems = [];
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var title = cartBox.getElementsByClassName('cart-product-title')[0].innerText;
        var price = cartBox.getElementsByClassName('cart-price')[0].innerText;
        var imageSrc = cartBox.getElementsByClassName('cart-img')[0].src;
        var quantity = cartBox.getElementsByClassName('cart-quantity')[0].value;

        cartItems.push({
            title: title,
            price: price,
            imageSrc: imageSrc,
            quantity: quantity
        });
    }
    console.log("Cart items:", cartItems);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log("Cart items saved to local storage.");
}


// Load cart items from local storage
function loadCartItems() {
    console.log("Loading cart items...");
    var cartItems = JSON.parse(localStorage.getItem('cartItems'));
    console.log("Retrieved cart items from local storage:", cartItems);
    if (cartItems) {
        for (var i = 0; i < cartItems.length; i++) {
            var cartItem = cartItems[i];
            console.log("Adding item to cart:", cartItem);
            addItemToCart(cartItem.title, cartItem.price, cartItem.imageSrc);

            // Set quantity for the added item
            var cartBoxes = document.getElementsByClassName('cart-box');
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
            quantityElement.value = cartItem.quantity;
        }
    }

    // Update total price
    var total = localStorage.getItem('total');
    if (total) {
        console.log("Updating total price:", total);
        document.getElementsByClassName('total-price')[0].innerText = '$' + total;
    }
    updateCartIcon();
}
// quantity in cart icon
function updateCartIcon() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var totalQuantity = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        totalQuantity += parseInt(quantityElement.value);
    }
    var cartIcon = document.querySelector('#cart-icon');
    cartIcon.setAttribute('data-quantity', totalQuantity);
    // If totalQuantity is 0, hide the number by setting it to an empty string
    //cartIcon.innerText = totalQuantity > 0 ? totalQuantity : '';
}
