const Category = require("../models/category.model.js");
const AppError = require("../utils/AppError.js");

const createCategory = async (data) => {
  const category = new Category(data);
  await category.save();
  return category.toJSON();
};

const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  return category ? category.toJSON() : null;
};

const getAllCategories = async (filters = {}) => {
  const query = {};

  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  const categories = await Category.find(query).sort({ sortOrder: 1, name: 1 });
  return categories.map((category) => category.toJSON());
};

const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  return category ? category.toJSON() : null;
};

const deleteCategory = async (id) => {
  // Check if category has products
  // const Product = require("../models/product.model.js");
  // const hasProducts = await Product.findOne({ category: id });
  // if (hasProducts) {
  //   throw AppError.badRequest("Cannot delete category with products");
  // }

  const category = await Category.findByIdAndDelete(id);
  return category ? category.toJSON() : null;
};

const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug });
  return category ? category.toJSON() : null;
};

const getActiveCategories = async () => {
  const categories = await Category.findActive();
  return categories.map((category) => category.toJSON());
};

const updateCategoryStatus = async (id, isActive) => {
  const category = await Category.findByIdAndUpdate(
    id,
    { isActive },
    { new: true, runValidators: true }
  );

  return category ? category.toJSON() : null;
};

const reorderCategories = async (categoryOrders) => {
  const promises = categoryOrders.map(({ id, sortOrder }) =>
    Category.findByIdAndUpdate(id, { sortOrder }, { new: true })
  );

  const categories = await Promise.all(promises);
  return categories.filter(Boolean).map((category) => category.toJSON());
};

module.exports = {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
  getActiveCategories,
  updateCategoryStatus,
  reorderCategories,
};
