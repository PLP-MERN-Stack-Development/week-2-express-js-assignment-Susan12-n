// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const cors = require('cors');
const mongoUrl = 'mongodb://localhost:27017/productsdb'; // Update with your MongoDB connection string

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 Not Found Error
class NotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

// 400 Validation Error
class ValidationError extends CustomError {
  constructor(message = 'Invalid input') {
    super(message, 400);
  }
}
// Middleware setup
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Authentication middleware
const authenticateAPIKey = (req, res, next) => {
  const apiKey = req.header('api-token');
  const validApiKey = '12345-abcde'; 

  if (apiKey === validApiKey) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }
};

// Validation middleware for product data
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof description !== 'string' || !description.trim() ||
    typeof price !== 'number' ||
    typeof category !== 'string' || !category.trim() ||
    typeof inStock !== 'boolean'
  ) {
    return next(new ValidationError('Invalid product data'));
  }

  next();
};



// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Hello world.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products, Handle asynchronous errors using try/catch blocks
app.get('/products', authenticateAPIKey, async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;

    const products = await someAsyncProductFetch(); // fetch all products

    // Filter by category if provided
    let filtered = products;
    if (category) {
      filtered = products.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Apply pagination
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;
    const paginatedProducts = filtered.slice(start, end);

    res.json({
      page: pageNum,
      limit: limitNum,
      total: filtered.length,
      results: paginatedProducts
    });
  } catch (err) {
    next(err);
  }
});


// GET /api/products/:id - Get a specific product
app.get('/products/:id', (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);

  if (!product) {
    return next(new NotFoundError(`Product with ID ${req.params.id} not found`));
  }

  res.json(product);
});

// POST /api/products - Create a new product
app.post('/products',authenticateAPIKey,validateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || typeof price !== 'number' || !category || typeof inStock !== 'boolean') {
    return res.status(400).json({ message: 'Invalid product data' });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});
// PUT /api/products/:id - Update a product
app.put('/products/:id', authenticateAPIKey, validateProduct, (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, description, price, category, inStock } = req.body;
  products[productIndex] = {
    id: req.params.id,
    name,
    description,
    price,
    category,
    inStock
  };

  res.json(products[productIndex]);
});

// DELETE /api/products/:id - Delete a product
app.delete('/products/:id', authenticateAPIKey, (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);

  if (index === -1) {
    return next(new NotFoundError('Product not found'));
  }

  const deletedProduct = products.splice(index, 1)[0];

  res.json({
    message: 'Product deleted',
    product: deletedProduct
  });
});


// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

//route that searches products by name
app.get('/products/search', authenticateAPIKey, async (req, res, next) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Search query "name" is required' });
    }

    const products = await someAsyncProductFetch();

    const result = products.filter(product =>
      product.name.toLowerCase().includes(name.toLowerCase())
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

//route that returns product statistics
app.get('/products/stats', authenticateAPIKey, async (req, res, next) => {
  try {
    const products = await someAsyncProductFetch(); // Fetch all products

    const stats = {};

    for (const product of products) {
      const category = product.category.toLowerCase();
      stats[category] = (stats[category] || 0) + 1;
    }

    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
});



// TODO: Implement custom middleware for:
// - Request logging
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next(); // Pass control to the next middleware/route
};
app.use(logger);


// - Error handling
// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
};
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 