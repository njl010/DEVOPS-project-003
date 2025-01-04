const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');  // Assuming you'll be interacting with external APIs via axios
const app = express();
const port =3000;

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

app.use(express.json()); // Middleware to parse JSON requests

// Simulate creating a new order
app.post('/orders', authenticateJWT, async (req, res) => {
  const { customerId, items } = req.body;

  if (!customerId || !items) {
    return res.status(400).json({ error: 'Customer ID and Items are required' });
  }

  try {
    // Simulate saving the order to a database or external system
    const order = {
      orderId: `order_${Math.floor(Math.random() * 1000000)}`,
      customerId,
      items,
      status: 'Order created',
    };
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Order creation failed' });
  }
});

// Simulate retrieving an order by orderId
app.get('/orders/:orderId', authenticateJWT, async (req, res) => {
  const { orderId } = req.params;

  try {
    // Simulate fetching order details from a database or external system
    const order = {
      orderId,
      customerId: 'customer123', // Example data
      items: [{ itemId: 'item1', quantity: 2 }, { itemId: 'item2', quantity: 1 }],
      status: 'Order retrieved',
    };
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

// Simulate updating an order
app.put('/orders/:orderId', authenticateJWT, async (req, res) => {
  const { orderId } = req.params;
  const { items } = req.body;

  if (!items) {
    return res.status(400).json({ error: 'Items are required' });
  }

  try {
    // Simulate updating the order
    const updatedOrder = {
      orderId,
      customerId: 'customer123', // Example data
      items,
      status: 'Order updated',
    };
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Order update failed' });
  }
});

// Simulate deleting an order
app.delete('/orders/:orderId', authenticateJWT, async (req, res) => {
  const { orderId } = req.params;

  try {
    // Simulate deleting the order
    res.json({ message: `Order ${orderId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Order deletion failed' });
  }
});

// Catch all route for root URL
app.get('/', (req, res) => {
  res.send('Order service running');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Order service running on http://0.0.0.0:${port}`);
});
