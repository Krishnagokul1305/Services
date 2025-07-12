# Product Service Test Data

## Categories Test Data (POST to /api/v1/categories)

### Category 1: Electronics

```json
{
  "name": "Electronics",
  "description": "Electronic devices and gadgets including smartphones, laptops, and accessories",
  "slug": "electronics",
  "image": "https://example.com/images/electronics.jpg",
  "isActive": true,
  "sortOrder": 1
}
```

### Category 2: Clothing

```json
{
  "name": "Clothing",
  "description": "Fashion and apparel for men, women, and children",
  "slug": "clothing",
  "image": "https://example.com/images/clothing.jpg",
  "isActive": true,
  "sortOrder": 2
}
```

### Category 3: Home & Garden

```json
{
  "name": "Home & Garden",
  "description": "Home improvement, furniture, and garden supplies",
  "slug": "home-garden",
  "image": "https://example.com/images/home-garden.jpg",
  "isActive": true,
  "sortOrder": 3
}
```

### Category 4: Sports & Outdoors

```json
{
  "name": "Sports & Outdoors",
  "description": "Sports equipment, outdoor gear, and fitness accessories",
  "slug": "sports-outdoors",
  "image": "https://example.com/images/sports.jpg",
  "isActive": true,
  "sortOrder": 4
}
```

### Category 5: Books

```json
{
  "name": "Books",
  "description": "Fiction, non-fiction, educational books, and e-books",
  "slug": "books",
  "image": "https://example.com/images/books.jpg",
  "isActive": true,
  "sortOrder": 5
}
```

## Products Test Data (POST to /api/v1/products)

**Note:** Replace the category IDs with actual ObjectIds from your created categories.

### Product 1: iPhone 15 Pro

```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest Apple iPhone with advanced camera system and A17 Pro chip",
  "shortDescription": "Premium smartphone with cutting-edge technology",
  "sku": "IPH15PRO001",
  "price": 999.99,
  "discountPercentage": 5,
  "category": "REPLACE_WITH_ELECTRONICS_CATEGORY_ID",
  "brand": "Apple",
  "tags": ["smartphone", "apple", "5g", "premium"],
  "images": [
    "https://example.com/images/iphone15pro-1.jpg",
    "https://example.com/images/iphone15pro-2.jpg"
  ],
  "status": "active",
  "featured": true
}
```

### Product 2: Nike Air Max 270

```json
{
  "name": "Nike Air Max 270",
  "description": "Comfortable running shoes with Air Max technology for superior cushioning",
  "shortDescription": "Premium running shoes with air cushioning",
  "sku": "NIKE270001",
  "price": 149.99,
  "discountPercentage": 20,
  "category": "REPLACE_WITH_SPORTS_CATEGORY_ID",
  "brand": "Nike",
  "tags": ["shoes", "running", "nike", "air-max"],
  "images": [
    "https://example.com/images/nike-airmax-1.jpg",
    "https://example.com/images/nike-airmax-2.jpg"
  ],
  "status": "active",
  "featured": false
}
```

### Product 3: The Great Gatsby

```json
{
  "name": "The Great Gatsby",
  "description": "Classic American novel by F. Scott Fitzgerald set in the Jazz Age",
  "shortDescription": "Timeless classic novel about the American Dream",
  "sku": "BOOK001GG",
  "price": 12.99,
  "discountPercentage": 0,
  "category": "REPLACE_WITH_BOOKS_CATEGORY_ID",
  "brand": "Scribner",
  "tags": ["fiction", "classic", "american-literature", "novel"],
  "images": ["https://example.com/images/great-gatsby.jpg"],
  "status": "active",
  "featured": true
}
```

### Product 4: Denim Jacket

```json
{
  "name": "Classic Denim Jacket",
  "description": "Vintage-style denim jacket perfect for casual wear and layering",
  "shortDescription": "Stylish denim jacket for everyday wear",
  "sku": "DENIM001JK",
  "price": 79.99,
  "discountPercentage": 15,
  "category": "REPLACE_WITH_CLOTHING_CATEGORY_ID",
  "brand": "Levi's",
  "tags": ["jacket", "denim", "casual", "vintage"],
  "images": [
    "https://example.com/images/denim-jacket-1.jpg",
    "https://example.com/images/denim-jacket-2.jpg"
  ],
  "status": "active",
  "featured": false
}
```

### Product 5: Smart Garden System

```json
{
  "name": "Smart Indoor Garden System",
  "description": "Automated hydroponic garden system for growing herbs and vegetables indoors",
  "shortDescription": "High-tech solution for indoor gardening",
  "sku": "GARDEN001SM",
  "price": 299.99,
  "discountPercentage": 10,
  "category": "REPLACE_WITH_HOME_GARDEN_CATEGORY_ID",
  "brand": "AeroGarden",
  "tags": ["garden", "hydroponic", "smart", "indoor"],
  "images": [
    "https://example.com/images/smart-garden-1.jpg",
    "https://example.com/images/smart-garden-2.jpg",
    "https://example.com/images/smart-garden-3.jpg"
  ],
  "status": "active",
  "featured": true
}
```

## API Endpoints for Testing

### Categories

- **GET** `/api/v1/categories` - Get all categories
- **GET** `/api/v1/categories/:id` - Get category by ID
- **GET** `/api/v1/categories/slug/:slug` - Get category by slug
- **POST** `/api/v1/categories` - Create new category
- **PUT** `/api/v1/categories/:id` - Update category
- **DELETE** `/api/v1/categories/:id` - Delete category

### Products

- **GET** `/api/v1/products` - Get all products
- **GET** `/api/v1/products/:id` - Get product by ID
- **GET** `/api/v1/products/slug/:slug` - Get product by slug
- **GET** `/api/v1/products/sku/:sku` - Get product by SKU
- **GET** `/api/v1/products/category/:categoryId` - Get products by category
- **GET** `/api/v1/products/featured` - Get featured products
- **GET** `/api/v1/products/search?q=searchterm` - Search products
- **POST** `/api/v1/products` - Create new product
- **PUT** `/api/v1/products/:id` - Update product
- **DELETE** `/api/v1/products/:id` - Delete product

### File Upload

- **POST** `/api/v1/upload/single` - Upload single image
- **POST** `/api/v1/upload/multiple` - Upload multiple images

### Example Upload Request (form-data)

```
Key: image (file)
Value: [select image file]

Optional:
Key: folder (text)
Value: products (or categories)
```
