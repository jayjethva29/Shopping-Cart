const mongoose = require('mongoose');
const Product = require('./productModel');

const reviewSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'customer is required for a review!'],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'product is required for a review!'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [100, 'only 100 charachters are allowed!'],
    required: [true, 'description is required for a review'],
  },
  rating: {
    type: Number,
    default: 0,
    // min: [1, 'please rate beteween 1-5!'],
    max: [5, 'please rate beteween 1-5!'],
  },

  image: String,
});

reviewSchema.index({ product: 1, customer: 1 }, { unique: true });

reviewSchema.statics.calcAvgRatings = async function (productId) {
  const stat = await this.aggregate([
    {
      $match: { product: productId, rating: { $gt: 0 } },
    },
    {
      $group: {
        _id: null,
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stat);
  await Product.findByIdAndUpdate(productId, {
    ratingsQuantity: stat[0]?.nRatings || 0,
    ratingsAverage: stat[0]?.avgRating || 0,
  });
};

reviewSchema.post('save', function () {
  this.constructor.calcAvgRatings(this.product);
});

reviewSchema.pre('findOneAndDelete', async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  this.review = doc;
  next();
});

reviewSchema.post('findOneAndDelete', function () {
  if (!this.review) return;
  this.review.constructor.calcAvgRatings(this.review.product);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
