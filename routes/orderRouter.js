const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// router.use(authController.protectRoute);

router.post('/create-checkout-session', orderController.getCheckoutSession);

router.post(
  '/payment',
  (req, res, next) => {
    req.body.amount = 525;
    next();
  },
  orderController.getPaymentIntent
);

router.post('/create', orderController.createOrder);

module.exports = router;
