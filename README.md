# Express.js PRODUCT MANAGEMENT RESTful API 
 A RESTful API using Express.js, implementing proper routing, middleware, and error handling  for managing products in an inventory.

##  Overview


1. Set up an Express.js server
2. Create RESTful API routes for a product resource
3. Implement custom middleware for logging, authentication, and validation
4. Add comprehensive error handling
5. Develop advanced features like filtering, pagination, and search

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Install dependencies:
   ```
   npm install
   ```
4. Run the server:
   ```
   npm start
   ```

## Files Included

- `Week2-Assignment.md`: Detailed assignment instructions
- `server.js`: Starter Express.js server file
- `.env.example`: Example environment variables file

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Postman, Insomnia, or curl for API testing




## API Endpoints

Base URL: http://localhost:3000
Auth Header:api-token :   12345-abcde

  ###🔐 Authentication
All endpoints require this header:

The API will have the following endpoints:

- `GET /api/products`: Get all products
- `GET /api/products/:id`: Get a specific product
- `POST /api/products`: Create a new product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product
-  `GET /products/search           :Search products by name
-  ` GET /products/stats           :Get product count by category



 1.POST /products – Create Product
Request Body:

json

{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
Response:
json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}

2.GET /products/stats – Product Count by Category

GET /products/stats
Response:
{
  "electronics": 2,
  "kitchen": 1
}

## Technologies Used
-Node.js

-Express.js

-In-memory storage (or MongoDB)

-Insomnia for testing
## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 