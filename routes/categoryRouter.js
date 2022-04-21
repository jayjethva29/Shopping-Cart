const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protectRoute, authController.isAdmin);

router
  .route('/')
  .post(categoryController.createCategory)
  .get(categoryController.getAllCategories);

router
  .route('/:id')
  .get(categoryController.isCategoryExists)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
