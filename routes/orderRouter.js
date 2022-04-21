const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.use(authController.protectRoute);

router.post('/create-checkout-session', orderController.getCheckoutSession);

router.post('/create', orderController.createOrder);

module.exports = router;
