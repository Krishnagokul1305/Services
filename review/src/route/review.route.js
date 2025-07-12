const express = require("express");
const { reviewController } = require("../controller/review.controller");
const { authenticateToken, optionalAuth } = require("../middleware/auth");
const { uploadFiles, uploadAndGetUrls } = require("../middleware/multer");

const router = express.Router();

// Public routes (with optional auth for user-specific data)
router.get(
  "/product/:productId",
  optionalAuth,
  reviewController.getProductReviews
);
router.get("/user/:userId", optionalAuth, reviewController.getUserReviews);
router.get("/:id", optionalAuth, reviewController.getReviewById);

router.use(authenticateToken);

router.post("/", uploadFiles, uploadAndGetUrls, reviewController.createReview);
router.put(
  "/:id",
  uploadFiles,
  uploadAndGetUrls,
  reviewController.updateReview
);
router.delete("/:id", reviewController.deleteReview);
router.patch("/:id/helpful", reviewController.markHelpful);
router.patch("/:id/unhelpful", reviewController.markUnhelpful);
router.patch("/:id/status", reviewController.updateStatus);

module.exports = router;
