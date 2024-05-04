const payBtn = document.querySelector('.btn-buy');

payBtn.addEventListener('click', () => {
    fetch('/stripe-checkout', { // Corrected route
        method: 'post',
        headers: new Headers({ 'Content-Type': 'application/json'}),
        body: JSON.stringify({
            items: JSON.parse(localStorage.getItem("cartItems")),
        }),
    }) 
    .then((res) => res.json())
    .then((url) => {
        // Redirect the user to the Stripe checkout page
        location.href = url; 
        clearCart();
    })
    .catch((err) => {
        console.error('Error:', err);
    });
});
