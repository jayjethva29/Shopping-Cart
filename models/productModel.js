const mongoose = require('mongoose');
const { promisify } = require('util');
const req = require('express/lib/request');
const { unlink } = require('fs');

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
  ratingsAverage: {
    type: Number,
    default: 0,
    set: (val) => val.toFixed(1),
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
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

productSchema.pre('findOneAndDelete', async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  this.product = doc;
  next();
});

productSchema.post('findOneAndDelete', function () {
  if (!this.product) return;

  const product = this.product;
  if (product.images.length > 0)
    product.images.forEach((img) => {
      promisify(unlink)(`${__dirname}/../Public/imgs/products/${img}`);
    });
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
