const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protectRoute);

router.get('/stats', reviewController.reviewStatastics);
router.get('/', reviewController.getAllReviewsById);

router.use(authController.isUser); // user specific routes

router
  .route('/')
  .post(
    (req, res, next) => {
      req.fileName = `review-${req.user.id}-${
        req.params.productId
      }-${Date.now()}`;
      next();
    },
    reviewController.uploadReviewImg,
    reviewController.resizeReviewImg,
    (req, res, next) => {
      req.body.customer = req.user.id;
      req.body.product = req.params.productId;
      next();
    },
    reviewController.createReview
  )
  .patch(
    (req, res, next) => {
      req.fileName = `review-${req.user.id}-${
        req.params.productId
      }-${Date.now()}`;
      next();
    },
    reviewController.uploadReviewImg,
    reviewController.resizeReviewImg,
    reviewController.updateReview
  )
  .delete(reviewController.deleteReview);

module.exports = router;
