const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  validateCart,
  getCartSummary,
  addMultipleToCart,
} = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Cart operations
router.get("/", getCart);
router.get("/summary", getCartSummary);
router.post("/add", addToCart);
router.post("/bulk-add", addMultipleToCart);
router.put("/item/:productId", updateCartItem);
router.delete("/item/:productId", removeFromCart);
router.delete("/clear", clearCart);
router.post("/validate", validateCart);

module.exports = router;
