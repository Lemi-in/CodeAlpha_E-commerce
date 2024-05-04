import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';

// Load environment variables
dotenv.config();

// Start server
const app = express();

app.use(express.static('public'));
app.use(express.json());

// Home Route
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "public" });
});
// Success Route
app.get('/success', (req, res) => {
    res.sendFile("success.html", { root: "public" });
});
// Cancel Route
app.get('/cancel', (req, res) => {
    res.sendFile("cancel.html", { root: "public" });
});

// Stripe route
let stripeGateway = new Stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;

app.post('/stripe-checkout', async (req, res) => {
    const lineItems = req.body.items.map((item) => {
        const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, '') * 100);
        console.log('item-price: ', item.price);
        console.log('unitAmount: ', unitAmount);
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    images: [item.imageSrc]
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,
        };
    });
    console.log('lineItems: ', lineItems);

    // Create Checkout Session
    const session = await stripeGateway.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${DOMAIN}/success`,
        cancel_url: `${DOMAIN}/cancel`,
        line_items: lineItems,
        //Asking Address in stripe checkout page

        billing_address_collection: 'required',

    });

    res.json(session.url);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
