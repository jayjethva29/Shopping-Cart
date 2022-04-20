const Category = require('../models/categoryModel');
const handllerFactory = require('../controllers/handllerFactory');
const AppError = require('../utils/AppError');

exports.createCategory = handllerFactory.createOne(Category);

exports.getAllCategories = handllerFactory.getAll(Category);

//exports.getCategoryById = handllerFactory.getOne(Category);
exports.isCategoryExists = async (req, res, next) => {
  try {
    if (!req.body.category) return next();

    const category = await Category.findById(req.body.category);
    if (!category)
      return next(new AppError(404, `No such category: ${req.body.category}!`));

    next();
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = handllerFactory.updateOne(Category);

exports.deleteCategory = handllerFactory.deleteOne(Category);
