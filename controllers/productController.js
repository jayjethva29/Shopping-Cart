const Product = require('../models/productModel');
const handllerFactory = require('../controllers/handllerFactory');
const AppError = require('../utils/AppError');
const FileManager = require('./FileManager');

exports.createProduct = handllerFactory.createOne(Product);

exports.getAllProducts = handllerFactory.getAll(Product);

exports.getProductById = handllerFactory.getOne(Product, {
  populate: ['category'],
});

exports.updateProduct = handllerFactory.updateOne(Product);

exports.deleteProduct = handllerFactory.deleteOne(Product);

exports.checkImageLimit = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product.images.length >= process.env.IMAGE_LIMIT)
      return next(new AppError(400, 'Delete an image to upload new one!'));

    req.product = product;
    next();
  } catch (err) {
    next(err);
  }
};

exports.saveProductImage = async (req, res, next) => {
  try {
    if (!req.body.image)
      return next(new AppError(404, 'No file found to upload!'));

    const product = req.product; //req.product is set in checkImageLimit middleware
    product.images.push(req.body.image);
    const doc = await product.save();
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProductImage = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    product.images.splice(product.images.indexOf(req.params.fileName), 1);
    const doc = await product.save();

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.uploadProductImg = FileManager.uploadFile(
  ['image/png', 'image/jpeg'],
  'image'
);

exports.resizeProductImg = FileManager.resizeFile(
  'image',
  'jpeg',
  'public/imgs/products'
);
