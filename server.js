const express = require('express');
const path = require('path');
const Razorpay = require('razorpay');
const app = express();
const port = 3000;

// Razorpay credentials
const razorpay = new Razorpay({
  key_id: 'rzp_live_i3ZxPZvkJubDIv',  // Your Razorpay API Key
  key_secret: 'FdIGZa91GzX7tLDEuwocFYeX',       // Your Razorpay Secret Key
});

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for your HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to create an order with Razorpay
app.post('/api/create-order', async (req, res) => {
    try {
        const { amount } = req.body;  // The amount passed in rupees (e.g., 8 rupees)

        // Convert the amount to paise (1 rupee = 100 paise)
        const amountInPaise = amount * 100;

        // Create the order with Razorpay
        const options = {
            amount: amountInPaise,  // Razorpay expects the amount in paise
            currency: 'INR',
            receipt: 'receipt#' + Math.floor(Math.random() * 1000),
            payment_capture: 1,  // Auto capture payment
        };

        // Create Razorpay order
        const order = await razorpay.orders.create(options);
        res.json({ orderId: order.id });  // Send back the order ID to the frontend
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: 'Error creating order. Please try again.' });
    }
});

// Route to handle orders after payment
app.post('/api/orders', (req, res) => {
    // Handle saving the order and payment details after success
    console.log("Payment success:", req.body);
    res.sendStatus(200);  // Acknowledge the request
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
