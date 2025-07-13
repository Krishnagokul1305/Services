const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [300, "Short description cannot exceed 300 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPercentage: {
      type: Number,
      min: [0, "Discount percentage cannot be negative"],
      max: [100, "Discount percentage cannot exceed 100"],
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [50, "Brand name cannot exceed 50 characters"],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be negative"],
        max: [5, "Rating cannot exceed 5"],
      },
      count: {
        type: Number,
        default: 0,
        min: [0, "Rating count cannot be negative"],
      },
    },
    publishedAt: {
      type: Date,
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

productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ "rating.average": -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ brand: 1 });

// Compound indexes
productSchema.index({ category: 1, status: 1 });
productSchema.index({ status: 1, featured: 1 });
productSchema.index({ category: 1, price: 1 });

// Text search index
productSchema.index({
  name: "text",
  description: "text",
  shortDescription: "text",
  brand: "text",
  tags: "text",
});

// Pre-save middleware to generate slug
productSchema.pre("save", function (next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Set publishedAt when status changes to active
  if (
    this.isModified("status") &&
    this.status === "active" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }

  next();
});

// Virtual field for discounted price
productSchema.virtual("discountedPrice").get(function () {
  if (this.discountPercentage > 0) {
    return this.price - (this.price * this.discountPercentage) / 100;
  }
  return this.price;
});

// Static methods
productSchema.statics.findActive = function () {
  return this.find({ status: "active" });
};

productSchema.statics.findFeatured = function () {
  return this.find({ status: "active", featured: true });
};

productSchema.statics.findByCategory = function (categoryId) {
  return this.find({ category: categoryId, status: "active" });
};

productSchema.statics.searchProducts = function (query) {
  return this.find(
    { $text: { $search: query } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
};

// Instance methods
productSchema.methods.calculateDiscountedPrice = function () {
  if (this.discountPercentage > 0) {
    return this.price - (this.price * this.discountPercentage) / 100;
  }
  return this.price;
};

productSchema.methods.hasDiscount = function () {
  return this.discountPercentage > 0;
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
