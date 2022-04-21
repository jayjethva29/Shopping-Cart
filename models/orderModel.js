const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    //   tour: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Tour',
    //     required: [true, 'Order must belong to a Tour!'],
    //   },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a User!'],
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
      require: [true, 'Order must have an amount'],
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
