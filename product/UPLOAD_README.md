# File Upload with Multer & AWS S3

## Overview

This product service includes file upload functionality using Multer middleware and AWS S3 storage for handling product and category images.

## Features

- Single and multiple image uploads
- Direct upload to AWS S3
- Image file type validation
- File size limits (5MB per file)
- Automatic file naming with timestamps
- Error handling for upload failures

## Setup

### 1. Install Dependencies

```bash
npm install aws-sdk multer multer-s3
```

### 2. AWS S3 Configuration

Create an AWS S3 bucket and configure the following environment variables in your `.env` file:

```env
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
```

### 3. S3 Bucket Permissions

Make sure your S3 bucket has the following permissions:

- `s3:PutObject` - For uploading files
- `s3:GetObject` - For reading files
- `s3:DeleteObject` - For deleting files

## API Endpoints

### Upload Single Image

**POST** `/api/v1/upload/single`

**Content-Type:** `multipart/form-data`

**Body:**

- `image` (file) - The image file to upload
- `folder` (text, optional) - S3 folder name (default: "products")

**Response:**

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://your-bucket.s3.amazonaws.com/products/1234567890-image.jpg",
    "key": "products/1234567890-image.jpg",
    "originalName": "image.jpg",
    "size": 102400,
    "mimetype": "image/jpeg"
  }
}
```

### Upload Multiple Images

**POST** `/api/v1/upload/multiple`

**Content-Type:** `multipart/form-data`

**Body:**

- `images[]` (files) - Array of image files (max 10)
- `folder` (text, optional) - S3 folder name (default: "products")

**Response:**

```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": {
    "files": [
      {
        "url": "https://your-bucket.s3.amazonaws.com/products/1234567890-image1.jpg",
        "key": "products/1234567890-image1.jpg",
        "originalName": "image1.jpg",
        "size": 102400,
        "mimetype": "image/jpeg"
      }
    ],
    "count": 1
  }
}
```

## File Restrictions

- **File Types:** Only image files (jpg, jpeg, png, gif, webp, etc.)
- **File Size:** Maximum 5MB per file
- **File Count:** Maximum 10 files per upload for multiple upload

## Usage Examples

### Using Postman

1. Set method to POST
2. Set URL to `http://localhost:8001/api/v1/upload/single`
3. Go to Body tab
4. Select "form-data"
5. Add key "image" with type "File" and select your image
6. Optionally add key "folder" with value "categories" or "products"

### Using cURL

```bash
# Single image upload
curl -X POST \
  http://localhost:8001/api/v1/upload/single \
  -F "image=@/path/to/your/image.jpg" \
  -F "folder=products"

# Multiple images upload
curl -X POST \
  http://localhost:8001/api/v1/upload/multiple \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg" \
  -F "folder=products"
```

### Using JavaScript (Frontend)

```javascript
// Single file upload
const uploadSingleImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", "products");

  const response = await fetch("/api/v1/upload/single", {
    method: "POST",
    body: formData,
  });

  return await response.json();
};

// Multiple files upload
const uploadMultipleImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });
  formData.append("folder", "products");

  const response = await fetch("/api/v1/upload/multiple", {
    method: "POST",
    body: formData,
  });

  return await response.json();
};
```

## Integration with Products/Categories

### When Creating Products

1. First upload images using the upload endpoint
2. Use the returned URLs in the product creation request

```javascript
// Step 1: Upload product images
const uploadResponse = await uploadMultipleImages(imageFiles);
const imageUrls = uploadResponse.data.files.map((file) => file.url);

// Step 2: Create product with image URLs
const productData = {
  name: "Product Name",
  description: "Product Description",
  sku: "PROD001",
  price: 99.99,
  category: "categoryId",
  images: imageUrls, // Use uploaded image URLs
  // ... other fields
};

const productResponse = await createProduct(productData);
```

## Error Handling

The upload endpoints handle various error scenarios:

- **No file provided:** Returns 400 with error message
- **Invalid file type:** Returns 400 with "Only image files are allowed!"
- **File too large:** Returns 400 with "File size too large. Maximum size is 5MB."
- **Too many files:** Returns 400 with "Too many files. Maximum is 10 files."
- **S3 upload failure:** Returns 500 with S3 error details

## Security Considerations

1. **File Type Validation:** Only image files are allowed
2. **File Size Limits:** Maximum 5MB per file
3. **File Count Limits:** Maximum 10 files per upload
4. **S3 Access Control:** Use proper IAM permissions
5. **Environment Variables:** Keep AWS credentials secure

## Folder Structure

Files are organized in S3 with the following structure:

```
your-s3-bucket/
├── products/
│   ├── 1234567890-product-image1.jpg
│   └── 1234567890-product-image2.jpg
└── categories/
    └── 1234567890-category-image.jpg
```

## Monitoring and Logs

- Upload attempts are logged with Morgan middleware
- Errors are handled by the global error handler
- S3 operations include error details for debugging
