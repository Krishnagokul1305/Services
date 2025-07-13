const express = require("express");
const reviewController = require("../controller/review.controller");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
router.get("/", reviewController.getAllReviewsController);
router.get("/product/:productId", reviewController.getProductReviewsController);
router.get("/user/:userId", reviewController.getUserReviewsController);
router.get("/overall-stats", reviewController.getReviewStatsController);
router.get(
  "/product-stats/:productId",
  reviewController.getProductReviewStatsController
);
router.get("/:id", reviewController.getReviewController);

router.use(authenticateToken);
router.post("/", authenticateToken, reviewController.createReviewController);
router.put("/:id", authenticateToken, reviewController.updateReviewController);
router.delete(
  "/:id",
  authenticateToken,
  reviewController.deleteReviewController
);
router.patch(
  "/:id/status",
  authenticateToken,
  reviewController.updateReviewStatusController
);

module.exports = router;
