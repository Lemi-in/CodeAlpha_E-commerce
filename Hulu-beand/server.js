import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

 
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


// Nodemailer stuff
const email_address = process.env.EMAIL_ADDRESS;
const email_password = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Change this to your email provider (e.g., 'Gmail', 'Outlook', 'Yahoo', etc.)
    auth: {
        user: email_address, // Change this to your email address
        pass: email_password   // Change this to your email password or app-specific password
    }
});

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handle form submission and send email
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Email content
    const mailOptions = {
        from: 'lemesaelias@gmail.com', // Sender email address
        to: 'lemesaelias@gmail.com', // Recipient email address
        subject: 'New Message from Contact Form', // Email subject
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}` // Email body
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
