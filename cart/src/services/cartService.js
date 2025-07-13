const Cart = require("../models/cart.model");
const productService = require("./productService");
const { AppError } = require("../utils/AppError");

const getCart = async (userId) => {
  try {
    let cart = await Cart.findByUser(userId);

    if (!cart) {
      cart = await Cart.createForUser(userId);
    }
    if (cart.items.length > 0) {
      const validationResults = await productService.validateCartItems(
        cart.items
      );
      const invalidItems = validationResults.filter(
        (result) => !result.available
      );

      if (invalidItems.length > 0) {
        for (const invalidItem of invalidItems) {
          await cart.removeItem(invalidItem.productId);
        }
        await cart.save();
      }

      cart = await Cart.findByUser(userId);
    }

    return cart;
  } catch (error) {
    throw AppError.internalError(`Failed to get cart: ${error.message}`);
  }
};

const addToCart = async (userId, productId, quantity = 1) => {
  try {
    const availability = await productService.checkProductAvailability(
      productId
    );

    if (!availability.available) {
      throw AppError.badRequest(
        `Cannot add product to cart: ${availability.reason}`
      );
    }

    let cart = await Cart.findByUser(userId);

    if (!cart) {
      cart = await Cart.createForUser(userId);
    }

    // Check if adding this quantity would exceed limits
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    const newQuantity = existingItem
      ? existingItem.quantity + quantity
      : quantity;

    if (newQuantity > 99) {
      throw AppError.badRequest(
        "Cannot add more than 99 items of the same product"
      );
    }

    await cart.addItem(availability.product, quantity);

    return await Cart.findByUser(userId);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw AppError.internalError(
      `Failed to add item to cart: ${error.message}`
    );
  }
};

const updateCartItem = async (userId, productId, quantity) => {
  try {
    if (quantity < 0) {
      throw AppError.badRequest("Quantity cannot be negative");
    }

    if (quantity > 99) {
      throw AppError.badRequest("Quantity cannot exceed 99");
    }

    const cart = await Cart.findByUser(userId);

    if (!cart) {
      throw AppError.notFound("Cart not found");
    }

    if (quantity > 0) {
      const availability = await productService.checkProductAvailability(
        productId
      );
      if (!availability.available) {
        throw AppError.badRequest(`Cannot update cart: ${availability.reason}`);
      }
    }

    await cart.updateItem(productId, quantity);

    return await Cart.findByUser(userId);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw AppError.internalError(
      `Failed to update cart item: ${error.message}`
    );
  }
};

const removeFromCart = async (userId, productId) => {
  try {
    const cart = await Cart.findByUser(userId);

    if (!cart) {
      throw AppError.notFound("Cart not found");
    }

    await cart.removeItem(productId);

    return await Cart.findByUser(userId);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw AppError.internalError(
      `Failed to remove item from cart: ${error.message}`
    );
  }
};

const clearCart = async (userId) => {
  try {
    const cart = await Cart.findByUser(userId);

    if (!cart) {
      throw AppError.notFound("Cart not found");
    }

    await cart.clearCart();

    return await Cart.findByUser(userId);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw AppError.internalError(`Failed to clear cart: ${error.message}`);
  }
};

const validateCart = async (userId) => {
  try {
    const cart = await Cart.findByUser(userId);

    if (!cart || cart.items.length === 0) {
      return {
        valid: true,
        cart: cart,
        issues: [],
      };
    }

    const validationResults = await productService.validateCartItems(
      cart.items
    );
    const issues = [];
    let hasChanges = false;

    for (const result of validationResults) {
      if (!result.available) {
        issues.push({
          productId: result.productId,
          issue: result.reason,
          action: "removed",
        });
        await cart.removeItem(result.productId);
        hasChanges = true;
      } else if (
        result.product.price !==
        cart.items.find((item) => item.product.toString() === result.productId)
          .price
      ) {
        issues.push({
          productId: result.productId,
          issue: "Price changed",
          action: "price_updated",
          oldPrice: cart.items.find(
            (item) => item.product.toString() === result.productId
          ).price,
          newPrice: result.product.price,
        });
        const itemIndex = cart.items.findIndex(
          (item) => item.product.toString() === result.productId
        );
        cart.items[itemIndex].price = result.product.price;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      await cart.save();
    }

    return {
      valid: issues.length === 0,
      cart: await Cart.findByUser(userId),
      issues: issues,
    };
  } catch (error) {
    throw AppError.internalError(`Failed to validate cart: ${error.message}`);
  }
};

const getCartSummary = async (userId) => {
  try {
    const cart = await getCart(userId);

    return {
      userId: userId,
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount,
      itemCount: cart.items.length,
      lastModified: cart.lastModified,
      isEmpty: cart.items.length === 0,
    };
  } catch (error) {
    throw AppError.internalError(
      `Failed to get cart summary: ${error.message}`
    );
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
};
