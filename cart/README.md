# Cart Service

A robust cart microservice for e-commerce platform with product validation and authentication.

## Features

✅ **User Cart Management** - Individual user carts with automatic creation
✅ **Product Validation** - Real-time product availability checking
✅ **Authentication Required** - JWT-based authentication at gateway level
✅ **Quantity Management** - Smart quantity limits and validation
✅ **Product Sync** - Automatic price updates and invalid item removal
✅ **Bulk Operations** - Add multiple items at once
✅ **Cart Validation** - Validate entire cart against current product data
✅ **Auto Cleanup** - Automatic cart expiration after 30 days
✅ **Error Handling** - Comprehensive error management

## API Endpoints

### Cart Operations

- `GET /api/cart` - Get user's cart
- `GET /api/cart/summary` - Get cart summary
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/bulk-add` - Add multiple items
- `PUT /api/cart/item/:productId` - Update item quantity
- `DELETE /api/cart/item/:productId` - Remove item
- `DELETE /api/cart/clear` - Clear entire cart
- `POST /api/cart/validate` - Validate cart items

### Gateway Routes (with Authentication)

- `GET /cart` - Get user's cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/item/:productId` - Update item
- `DELETE /cart/item/:productId` - Remove item

## Architecture

### Database Schema

```javascript
Cart {
  user: ObjectId (unique),
  items: [{
    product: ObjectId,
    quantity: Number (1-99),
    price: Number,
    productSnapshot: {
      name: String,
      image: String,
      sku: String,
      status: String
    },
    addedAt: Date
  }],
  totalItems: Number,
  totalAmount: Number,
  lastModified: Date,
  expiresAt: Date (30 days)
}
```

### Service Dependencies

- **Product Service** (localhost:8001) - Product validation and data
- **User Service** (localhost:3001) - User authentication
- **Gateway** (localhost:8000) - Authentication enforcement

## Installation

1. **Install Dependencies**

   ```bash
   cd cart
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Service**
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

## Configuration

### Environment Variables

```env
PORT=3004
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/cart_service
JWT_SECRET=your_jwt_secret_key_here
PRODUCT_SERVICE_URL=http://localhost:8001
USER_SERVICE_URL=http://localhost:3001
```

## Usage Examples

### Add Item to Cart

```bash
curl -X POST http://localhost:8000/cart/add \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "507f1f77bcf86cd799439011",
    "quantity": 2
  }'
```

### Get Cart

```bash
curl -X GET http://localhost:8000/cart \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Item Quantity

```bash
curl -X PUT http://localhost:8000/cart/item/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

### Bulk Add Items

```bash
curl -X POST http://localhost:8000/cart/bulk-add \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productId": "507f1f77bcf86cd799439011", "quantity": 2},
      {"productId": "507f1f77bcf86cd799439012", "quantity": 1}
    ]
  }'
```

## Product Validation

The cart service automatically validates products:

- **Availability Check** - Ensures products are active
- **Price Sync** - Updates prices when changed
- **Auto Removal** - Removes unavailable products
- **Status Monitoring** - Tracks product status changes

## Security Features

### Gateway-Level Authentication

- JWT token validation at API Gateway
- User context forwarded to cart service
- Protected routes require valid authentication

### Data Protection

- User can only access their own cart
- Product data validation
- Input sanitization and validation

## Performance Optimizations

- **Product Snapshots** - Cached product data for fast access
- **Indexed Queries** - Optimized database indexes
- **Bulk Operations** - Efficient multi-item operations
- **Auto Cleanup** - TTL indexes for expired carts

## Error Handling

The service provides comprehensive error handling:

- Product not found
- Product unavailable
- Quantity limits exceeded
- Authentication failures
- Service communication errors

## Monitoring

### Health Check

```bash
curl http://localhost:3004/health
```

Response:

```json
{
  "success": true,
  "message": "Cart service is running",
  "data": {
    "status": "OK",
    "service": "Cart Service",
    "version": "1.0.0",
    "uptime": 12345,
    "environment": "development"
  }
}
```

## Integration

### With Product Service

- Real-time product validation
- Price synchronization
- Availability checking

### With User Service

- User authentication
- Cart ownership validation

### With Gateway

- Authentication enforcement
- Request routing
- Error handling
