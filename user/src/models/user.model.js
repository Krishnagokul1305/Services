const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    passwordUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    avatar: {
      type: String,
      default: null,
    },
    resetToken: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
    name: {
      type: String,
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
    toJSON: {
      transform: function (doc, ret) {
        // Remove sensitive fields when converting to JSON
        delete ret.password;
        delete ret.resetToken;
        delete ret.resetTokenExpiry;
        delete ret.passwordUpdatedAt;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for better performance (email and username indexes are auto-created by unique: true)
userSchema.index({ resetToken: 1 });

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 10
  this.password = await bcrypt.hash(this.password, 10);

  // Update passwordUpdatedAt when password is changed
  if (!this.isNew) {
    this.passwordUpdatedAt = new Date();
  }

  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordUpdatedAt) {
    const changedTimestamp = parseInt(
      this.passwordUpdatedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

// Static method to find user by email or username
userSchema.statics.findByEmailOrUsername = function (identifier) {
  return this.find({
    $or: [{ email: identifier }, { username: identifier }],
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
