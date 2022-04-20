const mongoose = require('mongoose');
const Product = require('./productModel');

//TODO: add delivery date for each item
const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    unique: true,
    required: [true, 'customer is required for a cart!'],
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
  subtotal: {
    type: Number,
    default: 0,
  },
});

cartSchema.statics.updateSubTotal = async function (
  customerId,
  productId,
  quantity
) {
  const { price } = await Product.findById(productId).select('price');

  return await Cart.findOneAndUpdate(
    { customer: customerId },
    { $inc: { subtotal: price * quantity } },
    { new: true }
  );
};

const Cart = (module.exports = mongoose.model('Cart', cartSchema));
