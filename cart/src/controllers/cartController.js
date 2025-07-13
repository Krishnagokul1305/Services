const cartService = require("../services/cartService");
const { ApiResponse } = require("../utils/ApiResponse");
const { AppError } = require("../utils/AppError");
const Joi = require("joi");

// Validation schemas
const addToCartSchema = Joi.object({
  productId: Joi.string().required().messages({
    "any.required": "Product ID is required",
    "string.empty": "Product ID cannot be empty",
  }),
  quantity: Joi.number().integer().min(1).max(99).default(1).messages({
    "number.min": "Quantity must be at least 1",
    "number.max": "Quantity cannot exceed 99",
    "number.integer": "Quantity must be a whole number",
  }),
});

const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(0).max(99).required().messages({
    "any.required": "Quantity is required",
    "number.min": "Quantity cannot be negative",
    "number.max": "Quantity cannot exceed 99",
    "number.integer": "Quantity must be a whole number",
  }),
});

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCart(userId);

    res
      .status(200)
      .json(ApiResponse.success(cart, "Cart retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { error, value } = addToCartSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const userId = req.user.id;
    const { productId, quantity } = value;

    const cart = await cartService.addToCart(userId, productId, quantity);

    res
      .status(200)
      .json(ApiResponse.success(cart, "Item added to cart successfully"));
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { error, value } = updateCartItemSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = value;

    const cart = await cartService.updateCartItem(userId, productId, quantity);

    res
      .status(200)
      .json(ApiResponse.success(cart, "Cart item updated successfully"));
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    if (!productId) {
      return next(new AppError("Product ID is required", 400));
    }

    const cart = await cartService.removeFromCart(userId, productId);

    res
      .status(200)
      .json(ApiResponse.success(cart, "Item removed from cart successfully"));
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.clearCart(userId);

    res
      .status(200)
      .json(ApiResponse.success(cart, "Cart cleared successfully"));
  } catch (error) {
    next(error);
  }
};

const validateCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const validationResult = await cartService.validateCart(userId);

    const message = validationResult.valid
      ? "Cart is valid"
      : "Cart validation completed with issues";

    res.status(200).json(ApiResponse.success(validationResult, message));
  } catch (error) {
    next(error);
  }
};

const getCartSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const summary = await cartService.getCartSummary(userId);

    res
      .status(200)
      .json(
        ApiResponse.success(summary, "Cart summary retrieved successfully")
      );
  } catch (error) {
    next(error);
  }
};

// Bulk operations
const addMultipleToCart = async (req, res, next) => {
  try {
    const bulkSchema = Joi.object({
      items: Joi.array()
        .items(
          Joi.object({
            productId: Joi.string().required(),
            quantity: Joi.number().integer().min(1).max(99).default(1),
          })
        )
        .min(1)
        .max(10)
        .required(),
    });

    const { error, value } = bulkSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    const userId = req.user.id;
    const { items } = value;

    const results = [];
    let cart = await cartService.getCart(userId);

    for (const item of items) {
      try {
        cart = await cartService.addToCart(
          userId,
          item.productId,
          item.quantity
        );
        results.push({
          productId: item.productId,
          success: true,
          message: "Added successfully",
        });
      } catch (error) {
        results.push({
          productId: item.productId,
          success: false,
          message: error.message,
        });
      }
    }

    res
      .status(200)
      .json(
        ApiResponse.success({ cart, results }, "Bulk add to cart completed")
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  validateCart,
  getCartSummary,
  addMultipleToCart,
};
