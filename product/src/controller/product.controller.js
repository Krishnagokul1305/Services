const {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  getProductBySku,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
  updateProductStatus,
  toggleProductFeatured,
  getRelatedProducts,
  bulkUpdateProductStatus,
} = require("../service/product.service.js");

const { ApiResponse } = require("../utils/ApiResponse.js");
const { uploadAndGetUrls } = require("../utils/s3.js");

const createProductController = async (req, res, next) => {
  try {
    const {
      name,
      description,
      shortDescription,
      sku,
      price,
      discountPercentage,
      category,
      brand,
      tags,
      status,
      featured,
    } = req.body;

    if (!name || !description || !sku || !price || !category) {
      return res
        .status(400)
        .json(
          ApiResponse.error(
            "Name, description, SKU, price, and category are required"
          )
        );
    }

    // Upload images to S3 if files are provided
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = await uploadAndGetUrls(req.files, "products");
    }

    const productData = {
      name,
      description,
      shortDescription,
      sku: sku.toUpperCase(),
      price,
      discountPercentage: discountPercentage || 0,
      category,
      brand,
      tags: tags ? (typeof tags === "string" ? tags.split(",") : tags) : [],
      images: imageUrls,
      status: status || "draft",
      featured: featured || false,
    };

    const product = await createProduct(productData);

    res
      .status(201)
      .json(ApiResponse.created(product, "Product created successfully"));
  } catch (error) {
    next(error);
  }
};

const getAllProductsController = async (req, res, next) => {
  try {
    const {
      status,
      category,
      featured,
      brand,
      tags,
      priceMin,
      priceMax,
      search,
      page,
      limit,
      sort,
    } = req.query;

    const filters = {};
    const options = {};

    // Apply filters
    if (status) filters.status = status;
    if (category) filters.category = category;
    if (featured !== undefined) filters.featured = featured === "true";
    if (brand) filters.brand = brand;
    if (tags) filters.tags = tags.split(",");
    if (priceMin) filters.priceMin = parseFloat(priceMin);
    if (priceMax) filters.priceMax = parseFloat(priceMax);
    if (search) filters.search = search;

    // Apply options
    if (page) options.page = parseInt(page);
    if (limit) options.limit = parseInt(limit);
    if (sort) {
      const sortParams = sort.split(",");
      const sortObject = {};
      sortParams.forEach((param) => {
        if (param.startsWith("-")) {
          sortObject[param.substring(1)] = -1;
        } else {
          sortObject[param] = 1;
        }
      });
      options.sort = sortObject;
    }

    const result = await getAllProducts(filters, options);

    res
      .status(200)
      .json(ApiResponse.success(result, "Products retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

const getProductController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json(ApiResponse.notFound("Product not found"));
    }

    res
      .status(200)
      .json(ApiResponse.success(product, "Product retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

const getProductBySlugController = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await getProductBySlug(slug);

    if (!product) {
      return res.status(404).json(ApiResponse.notFound("Product not found"));
    }

    res
      .status(200)
      .json(ApiResponse.success(product, "Product retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

const getProductBySkuController = async (req, res, next) => {
  try {
    const { sku } = req.params;

    const product = await getProductBySku(sku.toUpperCase());

    if (!product) {
      return res.status(404).json(ApiResponse.notFound("Product not found"));
    }

    res
      .status(200)
      .json(ApiResponse.success(product, "Product retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

const updateProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Convert SKU to uppercase if provided
    if (updateData.sku) {
      updateData.sku = updateData.sku.toUpperCase();
    }

    // Handle tags if provided as string
    if (updateData.tags && typeof updateData.tags === "string") {
      updateData.tags = updateData.tags.split(",");
    }

    // Upload new images to S3 if files are provided
    if (req.files && req.files.length > 0) {
      const newImageUrls = await uploadAndGetUrls(req.files, "products");

      // If there are existing images, append new ones, otherwise replace
      if (updateData.images && Array.isArray(updateData.images)) {
        updateData.images = [...updateData.images, ...newImageUrls];
      } else {
        updateData.images = newImageUrls;
      }
    }

    const product = await updateProduct(id, updateData);

    if (!product) {
      return res.status(404).json(ApiResponse.notFound("Product not found"));
    }

    res
      .status(200)
      .json(ApiResponse.updated(product, "Product updated successfully"));
  } catch (error) {
    next(error);
  }
};

const deleteProductController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await deleteProduct(id);

    if (!product) {
      return res.status(404).json(ApiResponse.notFound("Product not found"));
    }

    res.status(200).json(ApiResponse.deleted("Product deleted successfully"));
  } catch (error) {
    next(error);
  }
};

const getFeaturedProductsController = async (req, res, next) => {
  try {
    const { limit } = req.query;

    const products = await getFeaturedProducts(
      limit ? parseInt(limit) : undefined
    );

    res
      .status(200)
      .json(
        ApiResponse.success(
          products,
          "Featured products retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getProductsByCategoryController = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { limit, sort } = req.query;

    const options = {};
    if (limit) options.limit = parseInt(limit);
    if (sort) {
      const sortParams = sort.split(",");
      const sortObject = {};
      sortParams.forEach((param) => {
        if (param.startsWith("-")) {
          sortObject[param.substring(1)] = -1;
        } else {
          sortObject[param] = 1;
        }
      });
      options.sort = sortObject;
    }

    const products = await getProductsByCategory(categoryId, options);

    res
      .status(200)
      .json(ApiResponse.success(products, "Products retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

const searchProductsController = async (req, res, next) => {
  try {
    const { q, limit } = req.query;

    if (!q) {
      return res
        .status(400)
        .json(ApiResponse.error("Search query is required"));
    }

    const options = {};
    if (limit) options.limit = parseInt(limit);

    const products = await searchProducts(q, options);

    res
      .status(200)
      .json(
        ApiResponse.success(products, "Search results retrieved successfully")
      );
  } catch (error) {
    next(error);
  }
};

const updateProductStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json(ApiResponse.error("Status is required"));
    }

    const validStatuses = ["draft", "active", "inactive", "archived"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json(ApiResponse.error("Invalid status value"));
    }

    const product = await updateProductStatus(id, status);

    if (!product) {
      return res.status(404).json(ApiResponse.notFound("Product not found"));
    }

    res
      .status(200)
      .json(
        ApiResponse.updated(product, "Product status updated successfully")
      );
  } catch (error) {
    next(error);
  }
};

const toggleProductFeaturedController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await toggleProductFeatured(id);

    res
      .status(200)
      .json(
        ApiResponse.updated(
          product,
          `Product ${product.featured ? "featured" : "unfeatured"} successfully`
        )
      );
  } catch (error) {
    next(error);
  }
};

const getRelatedProductsController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit } = req.query;

    const products = await getRelatedProducts(
      id,
      limit ? parseInt(limit) : undefined
    );

    res
      .status(200)
      .json(
        ApiResponse.success(products, "Related products retrieved successfully")
      );
  } catch (error) {
    next(error);
  }
};

const bulkUpdateProductStatusController = async (req, res, next) => {
  try {
    const { productIds, status } = req.body;

    if (!Array.isArray(productIds) || !status) {
      return res
        .status(400)
        .json(ApiResponse.error("Product IDs array and status are required"));
    }

    const validStatuses = ["draft", "active", "inactive", "archived"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json(ApiResponse.error("Invalid status value"));
    }

    const result = await bulkUpdateProductStatus(productIds, status);

    res
      .status(200)
      .json(ApiResponse.success(result, "Products updated successfully"));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProductController,
  getAllProductsController,
  getProductController,
  getProductBySlugController,
  getProductBySkuController,
  updateProductController,
  deleteProductController,
  getFeaturedProductsController,
  getProductsByCategoryController,
  searchProductsController,
  updateProductStatusController,
  toggleProductFeaturedController,
  getRelatedProductsController,
  bulkUpdateProductStatusController,
};
