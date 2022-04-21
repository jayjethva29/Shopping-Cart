const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'An order must belong to a user!'],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
        },
      },
    ],
    amount: {
      type: Number,
      require: [true, 'amount is required for an order!'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: 100,
      require: [true, 'address is required for an order!'],
    },
    paymentIntent: {
      type: String,
      required: [true, 'payment-intent is required for an order!'],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
