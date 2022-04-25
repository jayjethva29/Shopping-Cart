const { unlink } = require('fs');
const { promisify } = require('util');
const mongoose = require('mongoose');
const Review = require('../models/reviewModel');
const FileManager = require('./FileManager');
const AppError = require('../utils/AppError');

exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create(req.body);

    review.__v = undefined;
    res.status(200).json({
      status: 'success',
      data: {
        data: review,
      },
    });
  } catch (err) {
    //Delete the uploaded image
    promisify(unlink)(`${__dirname}/../Public/imgs/reviews/${req.body.image}`);
    next(err);
  }
};

exports.uploadReviewImg = FileManager.uploadFile(
  ['image/png', 'image/jpeg'],
  'image'
);

exports.resizeReviewImg = FileManager.resizeFile(
  'image',
  'jpeg',
  'public/imgs/reviews'
);

exports.getAllReviewsById = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate({
      path: 'customer',
      select: 'name',
    });

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: {
        data: reviews,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    //Get the review
    const review = await Review.findOne({
      product: req.params.productId,
      customer: req.user.id,
    });

    //Get the image(to be deleted) of the review
    const oldImage = review.image;

    //If review not found, delete the uploaded image
    if (!review) {
      promisify(unlink)(
        `${__dirname}/../Public/imgs/reviews/${req.body.image}`
      );
      return next(
        new AppError(404, `No data found for this id: ${req.params.productId}!`)
      );
    }

    //Update the review
    review.description = req.body.description;
    review.rating = req.body.rating;
    review.image = req.body.image || review.image;
    const updateReview = await review.save();

    //If there is oldimage and new image is uploaded then delete the old one
    if (oldImage && req.body.image)
      promisify(unlink)(`${__dirname}/../Public/imgs/reviews/${oldImage}`);

    res.status(200).json({
      status: 'success',
      data: {
        data: updateReview,
      },
    });
  } catch (err) {
    //Delete the uploaded image
    promisify(unlink)(`${__dirname}/../Public/imgs/reviews/${req.body.image}`);
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOneAndDelete({
      product: req.params.productId,
      customer: req.user.id,
    });

    if (!review)
      return next(
        new AppError(404, `No data found for this id: ${req.params.productId}!`)
      );

    //If the review has image, delete the file
    if (review.image) {
      await promisify(unlink)(
        `${__dirname}/../Public/imgs/reviews/${review.image}`
      );
    }

    res.status(200).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.reviewStatastics = async (req, res, next) => {
  try {
    const stats = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(req.params.productId),
        },
      },
      {
        $group: {
          _id: '$rating',
          numRatings: { $sum: 1 },
        },
      },
      {
        $project: {
          rating: '$_id',
          numRatings: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: stats.length,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
};
