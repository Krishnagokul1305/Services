const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Product reference is required"],
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      max: [99, "Quantity cannot exceed 99"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    // Snapshot of product data for performance and consistency
    productSnapshot: {
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        default: "",
      },
      sku: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User reference is required"],
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    totalItems: {
      type: Number,
      default: 0,
      min: [0, "Total items cannot be negative"],
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, "Total amount cannot be negative"],
    },
    lastModified: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      index: { expireAfterSeconds: 0 },
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

// Indexes for performance
cartSchema.index({ user: 1 });
cartSchema.index({ "items.product": 1 });
cartSchema.index({ lastModified: -1 });

// Pre-save middleware to calculate totals
cartSchema.pre("save", function (next) {
  this.totalItems = this.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  this.totalAmount = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  this.lastModified = new Date();
  next();
});

// Instance methods
cartSchema.methods.addItem = function (productData, quantity = 1) {
  const existingItemIndex = this.items.findIndex(
    (item) => item.product.toString() === productData._id.toString()
  );

  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].price = productData.price;
    this.items[existingItemIndex].productSnapshot = {
      name: productData.name,
      image: productData.images?.[0]?.url || "",
      sku: productData.sku,
      status: productData.status,
    };
  } else {
    // Add new item
    this.items.push({
      product: productData._id,
      quantity,
      price: productData.price,
      productSnapshot: {
        name: productData.name,
        image: productData.images?.[0]?.url || "",
        sku: productData.sku,
        status: productData.status,
      },
    });
  }

  return this.save();
};

cartSchema.methods.updateItem = function (productId, quantity) {
  const itemIndex = this.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (itemIndex === -1) {
    throw new Error("Item not found in cart");
  }

  if (quantity <= 0) {
    this.items.splice(itemIndex, 1);
  } else {
    this.items[itemIndex].quantity = quantity;
  }

  return this.save();
};

cartSchema.methods.removeItem = function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  return this.save();
};

cartSchema.methods.clearCart = function () {
  this.items = [];
  return this.save();
};

// Static methods
cartSchema.statics.findByUser = function (userId) {
  return this.findOne({ user: userId }).populate(
    "items.product",
    "name price status images sku"
  );
};

cartSchema.statics.createForUser = function (userId) {
  return this.create({ user: userId });
};

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
