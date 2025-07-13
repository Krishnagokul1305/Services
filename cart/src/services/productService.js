const axios = require("axios");
const { AppError } = require("../utils/AppError");

const baseURL = process.env.PRODUCT_SERVICE_URL || "http://localhost:8001";
const client = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getProductById = async (productId) => {
  try {
    const response = await client.get(`/api/products/${productId}`);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw AppError.notFound("Product not found");
    }
    throw AppError.internalError(`Product service error: ${error.message}`);
  }
};

const validateProducts = async (productIds) => {
  try {
    const response = await client.post("/api/products/validate", {
      productIds,
    });
    return response.data.data;
  } catch (error) {
    throw AppError.internalError(`Product validation error: ${error.message}`);
  }
};

const getProductsInfo = async (productIds) => {
  try {
    const response = await client.post("/api/products/bulk", {
      productIds,
    });
    return response.data.data;
  } catch (error) {
    throw AppError.internalError(`Product bulk fetch error: ${error.message}`);
  }
};

const checkProductAvailability = async (productId) => {
  try {
    const product = await getProductById(productId);

    return {
      available: product.status === "active",
      product: product,
      reason:
        product.status !== "active" ? `Product is ${product.status}` : null,
    };
  } catch (error) {
    return {
      available: false,
      product: null,
      reason: error.message,
    };
  }
};

const validateCartItems = async (cartItems) => {
  const validationResults = [];

  for (const item of cartItems) {
    try {
      const availability = await checkProductAvailability(item.product);
      validationResults.push({
        productId: item.product,
        quantity: item.quantity,
        available: availability.available,
        product: availability.product,
        reason: availability.reason,
      });
    } catch (error) {
      validationResults.push({
        productId: item.product,
        quantity: item.quantity,
        available: false,
        product: null,
        reason: error.message,
      });
    }
  }

  return validationResults;
};

module.exports = {
  getProductById,
  validateProducts,
  getProductsInfo,
  checkProductAvailability,
  validateCartItems,
};
