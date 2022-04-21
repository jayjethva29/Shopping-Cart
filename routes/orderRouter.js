const express = require('express');
const { request } = require('../app');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protectRoute);

router.get('/my-orders', orderController.getMyOrders);

router
  .route('/')
  .post(orderController.createOrder)
  .get(authController.isAdmin, orderController.getAllOrders);

router
  .route('/:id')
  .get(authController.isAdmin, orderController.getOrderById)
  .delete(authController.isAdmin, orderController.deleteOrder);

// router.post(
//   '/payment',
//   (req, res, next) => {
//     req.body.amount = 525;
//     next();
//   },
//   orderController.getPaymentIntent
// );

module.exports = router;
