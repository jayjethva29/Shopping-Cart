const express = require('express');
const productContoller = require('../controllers/productController');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const cartRouter = require('../routes/cartRouter');
const FileManager = require('../controllers/FileManager');

const router = express.Router();

router.use(authController.protectRoute);

// product -> cart
router.use('/:productId/cart-items', cartRouter);

router.post(
  '/:id/images',
  authController.isAdmin,
  productContoller.checkImageLimit,
  productContoller.uploadProductImg,
  productContoller.resizeProductImg,
  productContoller.saveProductImage
);

router.delete(
  '/:id/images/:fileName',
  (req, res, next) => {
    req.filePath = `public/imgs/products/${req.params.fileName}`;
    next();
  },
  authController.isAdmin,
  FileManager.deleteFile,
  productContoller.deleteProductImage
);

router
  .route('/:id')
  .get(productContoller.getProductById)
  .patch(
    authController.isAdmin,
    categoryController.isCategoryExists,
    productContoller.updateProduct
  )
  .delete(authController.isAdmin, productContoller.deleteProduct);

router
  .route('/')
  .post(
    authController.isAdmin,
    categoryController.isCategoryExists,
    productContoller.createProduct
  )
  .get(productContoller.getAllProducts);

module.exports = router;
