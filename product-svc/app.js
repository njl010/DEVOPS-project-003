const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(express.json());

// In-memory user data (for demonstration purposes)
const users = [
  { id: 1, username: 'testuser', password: 'password123' }
];

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Extract token from Authorization header
  if (!token) return res.sendStatus(401);  // Unauthorized if no token is provided

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) return res.sendStatus(403);  // Forbidden if token is invalid or expired
    req.user = user;  // Attach user info to request object
    next();  // Continue to the next middleware or route handler
  });
};

// Root route to avoid "Cannot GET /" error
app.get('/', (req, res) => {
  res.send('Welcome to the Product Service API!');
});

// Login route to generate a JWT token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password match
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });  // Unauthorized if credentials are incorrect
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, 'secret_key', { expiresIn: '1h' });
  res.json({ token });
});

// In-memory product store
let products = [];
let productIdCounter = 1;

// Endpoint to create a new product
app.post('/product', authenticateJWT, (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  // Create a new product
  const newProduct = {
    id: productIdCounter++,
    name,
    price,
    description: description || '',
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Endpoint to get all products
app.get('/products', authenticateJWT, (req, res) => {
  res.json(products);
});

// Endpoint to get a single product by ID
app.get('/product/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === parseInt(id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.listen(port, () => {
  console.log(`Product service running on port ${port}`);
});
