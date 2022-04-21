const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protectRoute);

router.patch('/add/:quantity', cartController.addToCart); // Nested
router.patch('/cart-items/:productId/:action', cartController.removeFromCart);

router.get('/my-cart', cartController.getMyCart);

router
  .route('/:id')
  .get(authController.isAdmin, cartController.getCartById)
  .delete(authController.isAdmin, cartController.deleteCart);

router.get('/', authController.isAdmin, cartController.getAllCarts);

module.exports = router;
