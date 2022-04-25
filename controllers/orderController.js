const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const handllerFactory = require('./handllerFactory');
const AppError = require('../utils/AppError');

exports.createOrder = handllerFactory.createOne(Order);

exports.getAllOrders = handllerFactory.getAll(Order);

exports.getOrderById = handllerFactory.getOne(Order, {
  populate: [
    {
      path: 'items.product',
      select: 'title description brand price shippingCost',
    },
  ],
});

exports.deleteOrder = handllerFactory.deleteOne(Order);

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user.id });
    if (!orders.length)
      return next(new AppError(404, `You don't have any order!`));
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

// exports.getPaymentIntent = async (req, res) => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: req.body.amount * 100,
//     currency: 'inr',
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// };
