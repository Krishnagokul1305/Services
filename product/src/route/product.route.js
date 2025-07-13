const express = require("express");
const {
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
} = require("../controller/product.controller.js");
const { uploadFiles } = require("../middleware/multer.js");

const router = express.Router();

// Product CRUD routes
router.post("/", uploadFiles, createProductController);
router.get("/", getAllProductsController);
router.get("/featured", getFeaturedProductsController);
router.get("/search", searchProductsController);
router.get("/slug/:slug", getProductBySlugController);
router.get("/sku/:sku", getProductBySkuController);
router.get("/category/:categoryId", getProductsByCategoryController);
router.get("/:id", getProductController);
router.patch("/:id", uploadFiles, updateProductController);
router.delete("/:id", deleteProductController);

// Product specific operations
router.get("/:id/related", getRelatedProductsController);
router.patch("/:id/status", updateProductStatusController);
router.patch("/:id/featured", toggleProductFeaturedController);
router.patch("/bulk/status", bulkUpdateProductStatusController);

module.exports = router;
