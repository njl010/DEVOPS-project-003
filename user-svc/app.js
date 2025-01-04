// user-service.js

const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const app = express();
const port = 80;

// Serve static files (like CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

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

// Sample user profile data
const userProfiles = {
  1: { id: 1, name: 'John Doe', age: 30 },
  2: { id: 2, name: 'Jane Smith', age: 28 },
};


app.get('/', (req, res) => {
  res.send('Welcome to the User Service API');
});

// Route to login and generate JWT (for testing purposes)
app.get('/login', (req, res) => {
  const user = { id: 1, name: 'John Doe' };  // Sample user
  const token = jwt.sign(user, 'secret_key');  // Generate JWT
  res.json({ token });
});

// Endpoint to get user profile, requiring JWT
app.get('/profile', authenticateJWT, (req, res) => {
  const userProfile = userProfiles[req.user.id];
  if (!userProfile) return res.status(404).json({ error: 'Profile not found' });

  res.json(userProfile);
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`User service running on http://0.0.0.0:${port}`);
});
