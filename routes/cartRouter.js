const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protectRoute);

router.patch('/add/:quantity', cartController.addToCart);
router.patch('/cart-items/:productId/:action', cartController.removeFromCart);

router.route('/:id').get(cartController.getCartById);

router.get('/', cartController.getAllCarts);

module.exports = router;
