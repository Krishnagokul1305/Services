# Product Microservice

## Overview

A comprehensive product management microservice built with Node.js, Express, and MongoDB. This service manages categories and products with full CRUD operations, advanced filtering, search capabilities, and inventory management.

## Features

### Category Management

- ✅ Hierarchical category structure (parent/child relationships)
- ✅ Category tree building
- ✅ Slug-based URL generation
- ✅ Category activation/deactivation
- ✅ Category reordering
- ✅ Root categories and subcategories

### Product Management

- ✅ Complete product CRUD operations
- ✅ Advanced product filtering and search
- ✅ Product variants and attributes
- ✅ Inventory tracking and low stock alerts
- ✅ SEO optimization fields
- ✅ Product status management (draft, active, inactive, archived)
- ✅ Featured products
- ✅ Related products
- ✅ Bulk operations
- ✅ Price comparison and cost tracking
- ✅ Product images and media management
- ✅ SKU management

### Advanced Features

- ✅ Full-text search with MongoDB text indexes
- ✅ Pagination and sorting
- ✅ Category-based product filtering
- ✅ Price range filtering
- ✅ Brand and tag filtering
- ✅ Stock status filtering
- ✅ Product rating system
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ RESTful API design

## Project Structure

```
product/
├── src/
│   ├── controller/
│   │   ├── category.controller.js    # Category endpoints
│   │   └── product.controller.js     # Product endpoints
│   ├── models/
│   │   ├── category.model.js         # Category schema
│   │   └── product.model.js          # Product schema
│   ├── route/
│   │   ├── category.route.js         # Category routes
│   │   └── product.route.js          # Product routes
│   ├── service/
│   │   ├── category.service.js       # Category business logic
│   │   └── product.service.js        # Product business logic
│   ├── utils/
│   │   ├── database.js               # MongoDB connection
│   │   ├── ApiResponse.js            # Standardized responses
│   │   ├── AppError.js               # Error handling
│   │   └── globalErrorHandler.js     # Global error middleware
│   └── app.js                        # Main application file
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Installation & Setup

1. **Clone and navigate to the product service:**

   ```bash
   cd product
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment setup:**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**

   ```env
   DATABASE_URL=mongodb://localhost:27017/productservice
   PORT=8001
   NODE_ENV=development
   ```

5. **Start the service:**

   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Categories

#### Basic CRUD

- `POST /api/v1/categories` - Create category
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

#### Advanced Operations

- `GET /api/v1/categories?tree=true` - Get category tree
- `GET /api/v1/categories/root` - Get root categories
- `GET /api/v1/categories/slug/:slug` - Get category by slug
- `GET /api/v1/categories/:id/subcategories` - Get subcategories
- `PATCH /api/v1/categories/:id/status` - Update category status
- `PATCH /api/v1/categories/reorder` - Reorder categories

### Products

#### Basic CRUD

- `POST /api/v1/products` - Create product
- `GET /api/v1/products` - Get all products (with filters)
- `GET /api/v1/products/:id` - Get product by ID
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

#### Advanced Operations

- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/low-stock` - Get low stock products
- `GET /api/v1/products/search?q=term` - Search products
- `GET /api/v1/products/slug/:slug` - Get product by slug
- `GET /api/v1/products/sku/:sku` - Get product by SKU
- `GET /api/v1/products/category/:categoryId` - Get products by category
- `GET /api/v1/products/:id/related` - Get related products
- `PATCH /api/v1/products/:id/status` - Update product status
- `PATCH /api/v1/products/:id/inventory` - Update inventory
- `PATCH /api/v1/products/:id/featured` - Toggle featured status
- `PATCH /api/v1/products/bulk/status` - Bulk update status

### Query Parameters

#### Product Filtering

```
GET /api/v1/products?status=active&category=123&featured=true&page=1&limit=10
```

**Available filters:**

- `status` - Product status (draft, active, inactive, archived)
- `category` - Category ID
- `featured` - Featured products (true/false)
- `brand` - Brand name
- `tags` - Comma-separated tags
- `priceMin` - Minimum price
- `priceMax` - Maximum price
- `inStock` - In stock products (true/false)
- `search` - Search term
- `page` - Page number for pagination
- `limit` - Items per page
- `sort` - Sorting (e.g., "price,-createdAt")

#### Category Filtering

```
GET /api/v1/categories?isActive=true&parentCategory=null&tree=true
```

**Available filters:**

- `isActive` - Active categories (true/false)
- `parentCategory` - Parent category ID (null for root categories)
- `tree` - Return hierarchical tree structure (true/false)

## Sample Data Structures

### Category Creation

```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories",
  "image": "https://example.com/electronics.jpg",
  "parentCategory": null,
  "sortOrder": 1
}
```

### Product Creation

```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced features",
  "shortDescription": "Pro iPhone with titanium design",
  "sku": "IPHONE15PRO128",
  "price": 999.99,
  "comparePrice": 1099.99,
  "category": "category_id_here",
  "brand": "Apple",
  "tags": ["smartphone", "apple", "pro"],
  "inventory": {
    "quantity": 50,
    "lowStockThreshold": 10,
    "trackQuantity": true
  },
  "images": [
    {
      "url": "https://example.com/iphone15pro.jpg",
      "alt": "iPhone 15 Pro",
      "isPrimary": true
    }
  ],
  "status": "active",
  "featured": true
}
```

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "timestamp": "2025-07-12T10:30:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2025-07-12T10:30:00.000Z"
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  },
  "timestamp": "2025-07-12T10:30:00.000Z"
}
```

## Database Schema

### Category Schema Features

- Hierarchical structure with parent-child relationships
- Automatic slug generation
- Active/inactive status
- Sort ordering
- Created/updated timestamps

### Product Schema Features

- Comprehensive product information
- Variant and attribute support
- Inventory tracking
- SEO optimization
- Rating system
- Multiple images
- Advanced pricing options

## Error Handling

The service includes comprehensive error handling for:

- Validation errors
- Database connection issues
- Duplicate key errors
- Cast errors
- Not found errors
- Permission errors

## Performance Features

- **Database Indexes**: Optimized queries with proper indexing
- **Text Search**: Full-text search capabilities
- **Pagination**: Efficient data loading
- **Population**: Optimized relationship queries
- **Caching Ready**: Structure supports caching implementation

## Health Check

Check service status:

```
GET /health
```

Returns:

```json
{
  "success": true,
  "message": "Product service is running",
  "timestamp": "2025-07-12T10:30:00.000Z",
  "service": "product-service",
  "version": "1.0.0"
}
```

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Development with hot reload

```bash
npm run dev
```

## Production Considerations

1. **Environment Variables**: Set appropriate production values
2. **Database**: Use MongoDB Atlas or dedicated MongoDB instance
3. **Logging**: Implement proper logging (Winston, etc.)
4. **Caching**: Add Redis for frequently accessed data
5. **Rate Limiting**: Implement API rate limiting
6. **Authentication**: Add JWT middleware for protected routes
7. **Monitoring**: Add health checks and monitoring

## License

ISC License
