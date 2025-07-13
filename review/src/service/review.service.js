const Review = require("../models/review.model.js");
const AppError = require("../utils/AppError.js");

// Create a new review
const createReview = async (data) => {
  try {
    const review = new Review(data);
    await review.save();
    return review.toJSON();
  } catch (error) {
    if (error.code === 11000) {
      throw AppError.conflict("You have already reviewed this product");
    }
    throw error;
  }
};

// Get review by ID
const getReviewById = async (id) => {
  const review = await Review.findById(id);
  return review ? review.toJSON() : null;
};

// Get all reviews with filters
const getAllReviews = async (filters = {}, options = {}) => {
  const query = {};

  // Apply filters
  if (filters.product) query.product = filters.product;
  if (filters.user) query.user = filters.user;
  if (filters.rating) query.rating = filters.rating;
  if (filters.status) query.status = filters.status;
  if (filters.verified !== undefined) query.verified = filters.verified;

  // Build query
  let reviewQuery = Review.find(query);

  // Apply sorting
  if (options.sort) {
    reviewQuery = reviewQuery.sort(options.sort);
  } else {
    reviewQuery = reviewQuery.sort({ createdAt: -1 });
  }

  // Apply pagination
  if (options.page && options.limit) {
    const skip = (options.page - 1) * options.limit;
    reviewQuery = reviewQuery.skip(skip).limit(options.limit);
  }

  const reviews = await reviewQuery;
  const total = await Review.countDocuments(query);

  return {
    reviews: reviews.map((review) => review.toJSON()),
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

// Get reviews for a specific product
const getReviewsByProduct = async (productId, options = {}) => {
  const page = options.page || 1;
  const limit = options.limit || 10;

  const reviews = await Review.findByProduct(productId, limit, page);
  const total = await Review.countDocuments({
    product: productId,
    status: "approved",
  });

  return {
    reviews: reviews.map((review) => review.toJSON()),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get reviews by user
const getReviewsByUser = async (userId, options = {}) => {
  const page = options.page || 1;
  const limit = options.limit || 10;

  const reviews = await Review.findByUser(userId, limit, page);
  const total = await Review.countDocuments({ user: userId });

  return {
    reviews: reviews.map((review) => review.toJSON()),
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get product rating statistics
const getProductRatingStats = async (productId) => {
  return await Review.getProductRatingStats(productId);
};

// Update review
const updateReview = async (id, data, userId) => {
  const review = await Review.findById(id);

  if (!review) {
    throw new AppError.notFound("Review not found");
  }

  // Check if user owns this review
  if (review.user.toString() !== userId) {
    throw new AppError.forbidden("You can only update your own reviews");
  }

  // Don't allow changing product, user, or status
  const allowedUpdates = ["rating", "title", "comment", "images"];
  const updateData = {};

  allowedUpdates.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedReview.toJSON();
};

// Delete review
const deleteReview = async (id, userId) => {
  const review = await Review.findById(id);

  if (!review) {
    throw new AppError.notFound("Review not found");
  }

  // Check if user owns this review
  if (review.user.toString() !== userId) {
    throw new AppError.forbidden("You can only delete your own reviews");
  }

  await Review.findByIdAndDelete(id);
  return { message: "Review deleted successfully" };
};

// Mark review as helpful
const markReviewHelpful = async (id) => {
  const review = await Review.findById(id);

  if (!review) {
    throw new AppError.notFound("Review not found");
  }

  await review.markHelpful();
  return review.toJSON();
};

const updateReviewStatus = async (id, status) => {
  const validStatuses = ["pending", "approved", "rejected"];

  if (!validStatuses.includes(status)) {
    throw new AppError.badRequest("Invalid status");
  }

  const review = await Review.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!review) {
    throw new AppError.notFound("Review not found");
  }

  return review.toJSON();
};

// Get review statistics
const getProductReviewStats = async () => {
  const stats = await Review.aggregate([
    {
      $group: {
        _id: "$productId", // Group by product
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
        pendingReviews: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
        approvedReviews: {
          $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
        },
        rejectedReviews: {
          $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        productId: "$_id",
        _id: 0,
        totalReviews: 1,
        averageRating: 1,
        pendingReviews: 1,
        approvedReviews: 1,
        rejectedReviews: 1,
      },
    },
  ]);

  return stats;
};

const getReviewStats = async () => {
  const stats = await Review.aggregate([
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
        pendingReviews: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
        approvedReviews: {
          $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
        },
        rejectedReviews: {
          $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      totalReviews: 0,
      averageRating: 0,
      pendingReviews: 0,
      approvedReviews: 0,
      rejectedReviews: 0,
    }
  );
};

module.exports = {
  createReview,
  getReviewById,
  getAllReviews,
  getReviewsByProduct,
  getReviewsByUser,
  getProductRatingStats,
  updateReview,
  getProductReviewStats,
  deleteReview,
  markReviewHelpful,
  updateReviewStatus,
  getReviewStats,
};
