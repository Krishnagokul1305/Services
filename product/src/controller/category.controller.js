const {
  createCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
  getActiveCategories,
  updateCategoryStatus,
  reorderCategories,
} = require("../service/category.service.js");

const { ApiResponse } = require("../utils/ApiResponse.js");

const createCategoryController = async (req, res, next) => {
  try {
    const { name, description, image, sortOrder } = req.body;

    if (!name) {
      return res
        .status(400)
        .json(ApiResponse.error("Category name is required"));
    }

    const categoryData = {
      name,
      description,
      image,
      sortOrder: sortOrder || 0,
    };

    const category = await createCategory(categoryData);

    res
      .status(201)
      .json(ApiResponse.created(category, "Category created successfully"));
  } catch (error) {
    next(error);
  }
};

const getAllCategoriesController = async (req, res, next) => {
  try {
    const { isActive } = req.query;

    const filters = {};
    if (isActive !== undefined) {
      filters.isActive = isActive === "true";
    }

    const categories = await getAllCategories(filters);

    res
      .status(200)
      .json(
        ApiResponse.success(categories, "Categories retrieved successfully")
      );
  } catch (error) {
    next(error);
  }
};

const getCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json(ApiResponse.notFound("Category not found"));
    }

    res
      .status(200)
      .json(ApiResponse.success(category, "Category retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlugController = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await getCategoryBySlug(slug);

    if (!category) {
      return res.status(404).json(ApiResponse.notFound("Category not found"));
    }

    res
      .status(200)
      .json(ApiResponse.success(category, "Category retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

const updateCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const category = await updateCategory(id, updateData);

    if (!category) {
      return res.status(404).json(ApiResponse.notFound("Category not found"));
    }

    res
      .status(200)
      .json(ApiResponse.updated(category, "Category updated successfully"));
  } catch (error) {
    next(error);
  }
};

const deleteCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await deleteCategory(id);

    if (!category) {
      return res.status(404).json(ApiResponse.notFound("Category not found"));
    }

    res.status(200).json(ApiResponse.deleted("Category deleted successfully"));
  } catch (error) {
    next(error);
  }
};

const getActiveCategoriesController = async (req, res, next) => {
  try {
    const categories = await getActiveCategories();

    res
      .status(200)
      .json(
        ApiResponse.success(
          categories,
          "Active categories retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const updateCategoryStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res
        .status(400)
        .json(ApiResponse.error("isActive field is required"));
    }

    const category = await updateCategoryStatus(id, isActive);

    if (!category) {
      return res.status(404).json(ApiResponse.notFound("Category not found"));
    }

    res
      .status(200)
      .json(
        ApiResponse.updated(category, "Category status updated successfully")
      );
  } catch (error) {
    next(error);
  }
};

const reorderCategoriesController = async (req, res, next) => {
  try {
    const { categoryOrders } = req.body;

    if (!Array.isArray(categoryOrders)) {
      return res
        .status(400)
        .json(ApiResponse.error("categoryOrders must be an array"));
    }

    const categories = await reorderCategories(categoryOrders);

    res
      .status(200)
      .json(
        ApiResponse.success(categories, "Categories reordered successfully")
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategoryController,
  getAllCategoriesController,
  getCategoryController,
  getCategoryBySlugController,
  updateCategoryController,
  deleteCategoryController,
  getActiveCategoriesController,
  updateCategoryStatusController,
  reorderCategoriesController,
};
