const express = require("express");
const {
  createCategoryController,
  getAllCategoriesController,
  getCategoryController,
  getCategoryBySlugController,
  updateCategoryController,
  deleteCategoryController,
  getActiveCategoriesController,
  updateCategoryStatusController,
  reorderCategoriesController,
} = require("../controller/category.controller.js");

const router = express.Router();

// Category CRUD routes
router.post("/", createCategoryController);
router.get("/", getAllCategoriesController);
router.get("/active", getActiveCategoriesController);
router.get("/slug/:slug", getCategoryBySlugController);
router.get("/:id", getCategoryController);
router.put("/:id", updateCategoryController);
router.delete("/:id", deleteCategoryController);

// Category specific operations
router.patch("/:id/status", updateCategoryStatusController);
router.patch("/reorder", reorderCategoriesController);

module.exports = router;
