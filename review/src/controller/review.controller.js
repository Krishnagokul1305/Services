const {
  createReview,
  getReviewById,
  getAllReviews,
  getReviewsByProduct,
  getReviewsByUser,
  getProductRatingStats,
  updateReview,
  deleteReview,
  markReviewHelpful,
  updateReviewStatus,
  getReviewStats,
} = require("../service/review.service.js");

const { ApiResponse } = require("../utils/ApiResponse.js");
const { uploadAndGetUrls } = require("../utils/s3.js");

// Create a new review
const createReviewController = async (req, res, next) => {
  try {
    const {
      product,
      rating,
      title,
      comment,
      verified,
      userName,
      userEmail,
      productName,
      productSku,
    } = req.body;

    // Get user ID from request (assuming auth middleware sets req.user)
    const user = req.user?.id || req.body.user;

    if (!product || !user || !rating || !title || !comment) {
      return res
        .status(400)
        .json(
          ApiResponse.error(
            "Product, user, rating, title, and comment are required"
          )
        );
    }

    if (!userName || !userEmail || !productName || !productSku) {
      return res
        .status(400)
        .json(ApiResponse.error("User and product information are required"));
    }

    // Upload images if provided
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = await uploadAndGetUrls(req.files, "reviews");
    }

    const reviewData = {
      product,
      user,
      rating,
      title,
      comment,
      verified: verified || false,
      images: imageUrls,
      userName,
      userEmail,
      productName,
      productSku,
    };

    const review = await createReview(reviewData);

    res
      .status(201)
      .json(ApiResponse.created(review, "Review created successfully"));
  } catch (error) {
    next(error);
  }
};

// Get all reviews
const getAllReviewsController = async (req, res, next) => {
  try {
    const { product, user, rating, status, verified, page, limit, sort } =
      req.query;

    const filters = {};
    const options = {};

    // Apply filters
    if (product) filters.product = product;
    if (user) filters.user = user;
    if (rating) filters.rating = parseInt(rating);
    if (status) filters.status = status;
    if (verified !== undefined) filters.verified = verified === "true";

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

    const result = await getAllReviews(filters, options);

    res
      .status(200)
      .json(ApiResponse.success(result, "Reviews retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

// Get review by ID
const getReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await getReviewById(id);

    if (!review) {
      return res.status(404).json(ApiResponse.notFound("Review not found"));
    }

    res
      .status(200)
      .json(ApiResponse.success(review, "Review retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

// Get reviews for a product
const getProductReviewsController = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page, limit, sort } = req.query;

    const options = {};
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

    const result = await getReviewsByProduct(productId, options);

    res
      .status(200)
      .json(
        ApiResponse.success(result, "Product reviews retrieved successfully")
      );
  } catch (error) {
    next(error);
  }
};

// Get reviews by user
const getUserReviewsController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page, limit } = req.query;

    const options = {};
    if (page) options.page = parseInt(page);
    if (limit) options.limit = parseInt(limit);

    const result = await getReviewsByUser(userId, options);

    res
      .status(200)
      .json(ApiResponse.success(result, "User reviews retrieved successfully"));
  } catch (error) {
    next(error);
  }
};

// Get product rating statistics
const getProductRatingController = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const stats = await getProductRatingStats(productId);

    res
      .status(200)
      .json(
        ApiResponse.success(
          stats,
          "Product rating stats retrieved successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

// Update review
const updateReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Get user ID from request (assuming auth middleware)
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res
        .status(401)
        .json(ApiResponse.error("User authentication required"));
    }

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      const newImageUrls = await uploadAndGetUrls(req.files, "reviews");

      if (updateData.images && Array.isArray(updateData.images)) {
        updateData.images = [...updateData.images, ...newImageUrls];
      } else {
        updateData.images = newImageUrls;
      }
    }

    const review = await updateReview(id, updateData, userId);

    res
      .status(200)
      .json(ApiResponse.updated(review, "Review updated successfully"));
  } catch (error) {
    next(error);
  }
};

// Delete review
const deleteReviewController = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get user ID from request (assuming auth middleware)
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res
        .status(401)
        .json(ApiResponse.error("User authentication required"));
    }

    const result = await deleteReview(id, userId);

    res.status(200).json(ApiResponse.deleted(result.message));
  } catch (error) {
    next(error);
  }
};

// Mark review as helpful
const markReviewHelpfulController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await markReviewHelpful(id);

    res
      .status(200)
      .json(ApiResponse.updated(review, "Review marked as helpful"));
  } catch (error) {
    next(error);
  }
};

// Admin: Update review status
const updateReviewStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json(ApiResponse.error("Status is required"));
    }

    const review = await updateReviewStatus(id, status);

    res
      .status(200)
      .json(ApiResponse.updated(review, "Review status updated successfully"));
  } catch (error) {
    next(error);
  }
};

// Get review statistics
const getReviewStatsController = async (req, res, next) => {
  try {
    const stats = await getReviewStats();

    res
      .status(200)
      .json(
        ApiResponse.success(stats, "Review statistics retrieved successfully")
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReviewController,
  getAllReviewsController,
  getReviewController,
  getProductReviewsController,
  getUserReviewsController,
  getProductRatingController,
  updateReviewController,
  deleteReviewController,
  markReviewHelpfulController,
  updateReviewStatusController,
  getReviewStatsController,
};
