const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    verified: {
      type: Boolean,
      default: false, // Set to true if user actually purchased the product
    },
    helpful: {
      type: Number,
      default: 0, // Number of users who found this review helpful
    },
    images: [
      {
        type: String, // URLs of review images
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index to ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Indexes for performance
reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

// Static method to get average rating for a product
reviewSchema.statics.getAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: "approved",
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingBreakdown: {
          $push: "$rating",
        },
      },
    },
  ]);

  if (stats.length > 0) {
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratingBreakdown.forEach((rating) => {
      breakdown[rating]++;
    });

    return {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      breakdown,
    };
  }

  return {
    averageRating: 0,
    totalReviews: 0,
    breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };
};

// Static method to find approved reviews for a product
reviewSchema.statics.findApprovedByProduct = function (productId) {
  return this.find({
    product: productId,
    status: "approved",
  })
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};

// Static method to find user's reviews
reviewSchema.statics.findByUser = function (userId) {
  return this.find({ user: userId })
    .populate("product", "name images sku")
    .sort({ createdAt: -1 });
};

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
