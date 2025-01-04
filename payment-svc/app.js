const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

// Middleware to validate JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user;
    next();
  });
};

// Simulate processing a payment
app.post('/pay', authenticateJWT, (req, res) => {
  const { amount, orderId } = req.body;

  if (!amount || !orderId) {
    return res.status(400).json({ error: 'Amount and Order ID are required' });
  }

  // Simulate a payment success
  const paymentResult = {
    orderId,
    amount,
    status: 'Payment successful',
    transactionId: `txn_${Math.floor(Math.random() * 1000000)}`,
  };

  res.json(paymentResult);
});

// Catch all route for root URL
app.get('/', (req, res) => {
  res.send('Payment service running');
});

// Start the server
app.listen(port, () => {
  console.log(`Payment service running on http://localhost:${port}`);
});
