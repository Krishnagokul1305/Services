const Product = require("../models/product.model.js");
const Category = require("../models/category.model.js");
const AppError = require("../utils/AppError.js");

const createProduct = async (data) => {
  const category = await Category.findById(data.category);
  if (!category) {
    throw AppError.notFound("Category not found");
  }
  const product = new Product(data);
  await product.save();

  return await Product.findById(product._id).populate("category", "name slug");
};

const getProductById = async (id) => {
  const product = await Product.findById(id).populate("category", "name slug");
  return product ? product.toJSON() : null;
};

const getAllProducts = async (filters = {}, options = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.featured !== undefined) {
    query.featured = filters.featured;
  }

  if (filters.brand) {
    query.brand = new RegExp(filters.brand, "i");
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  if (filters.priceMin || filters.priceMax) {
    query.price = {};
    if (filters.priceMin) query.price.$gte = filters.priceMin;
    if (filters.priceMax) query.price.$lte = filters.priceMax;
  }

  // Search functionality
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  // Build the query
  let productQuery = Product.find(query).populate("category", "name slug");

  // Apply sorting
  if (options.sort) {
    productQuery = productQuery.sort(options.sort);
  } else if (filters.search) {
    productQuery = productQuery.sort({ score: { $meta: "textScore" } });
  } else {
    productQuery = productQuery.sort({ createdAt: -1 });
  }

  // Apply pagination
  if (options.page && options.limit) {
    const skip = (options.page - 1) * options.limit;
    productQuery = productQuery.skip(skip).limit(options.limit);
  }

  const products = await productQuery;
  const total = await Product.countDocuments(query);

  return {
    products: products.map((product) => product.toJSON()),
    pagination:
      options.page && options.limit
        ? {
            page: options.page,
            limit: options.limit,
            total,
            pages: Math.ceil(total / options.limit),
          }
        : null,
  };
};

const updateProduct = async (id, data) => {
  // Validate category if being updated
  if (data.category) {
    const category = await Category.findById(data.category);
    if (!category) {
      throw AppError.notFound("Category not found");
    }
  }

  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("category", "name slug");

  return product ? product.toJSON() : null;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  return product ? product.toJSON() : null;
};

const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug }).populate(
    "category",
    "name slug"
  );
  return product ? product.toJSON() : null;
};

const getProductBySku = async (sku) => {
  const product = await Product.findOne({ sku }).populate(
    "category",
    "name slug"
  );
  return product ? product.toJSON() : null;
};

const getFeaturedProducts = async (limit = 10) => {
  const products = await Product.findFeatured()
    .populate("category", "name slug")
    .limit(limit)
    .sort({ createdAt: -1 });

  return products.map((product) => product.toJSON());
};

const getProductsByCategory = async (categoryId, options = {}) => {
  const query = { category: categoryId, status: "active" };

  let productQuery = Product.find(query).populate("category", "name slug");

  if (options.sort) {
    productQuery = productQuery.sort(options.sort);
  } else {
    productQuery = productQuery.sort({ createdAt: -1 });
  }

  if (options.limit) {
    productQuery = productQuery.limit(options.limit);
  }

  const products = await productQuery;
  return products.map((product) => product.toJSON());
};

const searchProducts = async (searchTerm, options = {}) => {
  const products = await Product.searchProducts(searchTerm)
    .populate("category", "name slug")
    .limit(options.limit || 20);

  return products.map((product) => product.toJSON());
};

const updateProductStatus = async (id, status) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).populate("category", "name slug");

  return product ? product.toJSON() : null;
};

const toggleProductFeatured = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw AppError.notFound("Product not found");
  }

  product.featured = !product.featured;
  await product.save();

  const updatedProduct = await Product.findById(id).populate(
    "category",
    "name slug"
  );
  return updatedProduct.toJSON();
};

const getRelatedProducts = async (productId, limit = 5) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw AppError.notFound("Product not found");
  }

  const relatedProducts = await Product.find({
    _id: { $ne: productId },
    category: product.category,
    status: "active",
  })
    .populate("category", "name slug")
    .limit(limit)
    .sort({ "rating.average": -1, createdAt: -1 });

  return relatedProducts.map((product) => product.toJSON());
};

const bulkUpdateProductStatus = async (productIds, status) => {
  const result = await Product.updateMany(
    { _id: { $in: productIds } },
    { status },
    { runValidators: true }
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};

module.exports = {
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
};
