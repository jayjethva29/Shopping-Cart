const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const factory = require('./handllerFactory');
const AppError = require('../utils/AppError');
const User = require('../models/userModel');
const res = require('express/lib/response');

exports.getCheckoutSession = async (req, res, next) => {
  try {
    // 1) Get the cart of current user
    const cart = await Cart.findOne({
      customer: '625d6023c9dd4d56df5cb02d', // req.user.id
    }).populate('items.product');

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          name: `Dell Vostro 15`,
          description: 'i5, 8gb RAM, 16inch screen ',
          images: [
            'https://m.media-amazon.com/images/I/51if47n2aPL._AC_SL1000_.jpg',
          ],
          amount: cart.subtotal * 100,
          currency: 'inr',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/Stripe/success.html`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel.html`,
      customer_email: 'jayjethva2018@gmail.com', // req.user.email
      client_reference_id: cart.id,
    });

    console.log('payment_intent: ' + session.payment_intent);
    res.redirect(303, session.url);
  } catch (err) {
    next(err);
  }
};

exports.createOrder = async () => {
  const cartId = session.client_reference_id;
  const cart = await Cart.findById(cartId);
  // const user = await User.findOne({ email: session.customer_email });
  // const amount = session.line_items[0].amount/100;

  await Order.create({
    user: cart.customer,
    items: cart.items,
    amount: cart.subtotal,
    // address:
    // paymentIntent:
  });
};

//TODO: create process.env.STRIPE_WEBHOOK_KEY
exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'stripe.session.completed') createOrder(event.data.object);

  res.status(200).json({ received: true });
};
