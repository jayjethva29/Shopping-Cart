const req = require('express/lib/request');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title is requierd for a product'],
    trim: true,
    lowercase: true,
  },
  price: {
    type: Number,
    required: [true, 'price is required for a product'],
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  availibility: {
    type: Number,
    required: [true, 'availibility is required for a product'],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    trim: true,
    required: [true, 'category is required for a product'],
  },
  brand: {
    type: String,
    required: [true, 'brand is required for a product'],
  },
  coverImage: {
    type: String,
    default: 'default.png',
  },
  images: [String],
});

productSchema.statics.updateAvailibility = async function (
  productId,
  quantity
) {
  await this.updateOne(
    { _id: productId },
    {
      $inc: { availibility: quantity },
    }
  );
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
