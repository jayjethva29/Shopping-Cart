const { remove } = require('../models/cartModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const AppError = require('../utils/AppError');
const handllerFactory = require('./handllerFactory');

exports.createCart = async (req, res, next) => {
  try {
    await Cart.create({ customer: req.userId });
  } catch (err) {
    next(err);
  }
};

exports.getAllCarts = handllerFactory.getAll(Cart);

exports.getCartById = handllerFactory.getOne(Cart, {
  populate: [
    {
      path: 'customer',
      select: 'name',
    },
  ],
});

exports.deleteCart = handllerFactory.deleteOne(Cart);

exports.addToCart = async (req, res, next) => {
  try {
    // 0. Get Product (TO check availability)
    const product = await Product.findById(req.params.productId);
    if (!product)
      return next(
        new AppError(
          404,
          `No product found with the id: ${req.params.productId}`
        )
      );

    // Check availibility
    if (product.availibility < req.params.quantity * 1)
      return next(
        new AppError(404, `Only ${product.availibility} items  available!`)
      );

    // 1. Get cart of the current user
    const cart = await Cart.findOne({ customer: req.user.id });

    // 2. Find the item in the cart
    let item = cart.items.find((el) => el.product == req.params.productId);

    // 3. If the item is found then update quantity
    if (item) {
      item.quantity = item.quantity + req.params.quantity * 1;
    }
    // 4. Else create new item and push into the cart
    else {
      item = {
        product: req.params.productId,
        quantity: req.params.quantity,
      };
      cart.items.push(item);
    }

    // 5. Save the cart
    await cart.save();

    // 6. Update subtotal
    const result = await Cart.updateSubTotal(
      req.user.id,
      req.params.productId,
      req.params.quantity
    );

    // 7. Update the availibility
    Product.updateAvailibility(req.params.productId, -req.params.quantity);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    let quantity = 0;

    if (req.params.action === 'remove') {
      // 1. Get quantity of the item to be removed
      const cart = await Cart.findOne({ customer: req.user.id });
      const item = cart.items.find((el) => el.product == req.params.productId);

      if (!item)
        return next(
          new AppError(
            404,
            `No item found with the id: ${req.params.productId}`
          )
        );
      quantity = item.quantity;

      // 2. Remove the item from the cart
      await cart.updateOne({
        $pull: {
          items: {
            product: req.params.productId,
          },
        },
      });
    }

    if (req.params.action === 'decrease') {
      quantity = 1;
      // 1. Update quantity of the item
      const result = await Cart.updateOne(
        {
          customer: req.user.id,
          'items.product': req.params.productId,
          'items.quantity': { $gt: 1 },
        },
        { $inc: { 'items.$.quantity': -1 } }
      );

      if (!result.modifiedCount)
        return next(
          new AppError(
            400,
            `Quantity can't be decreased OR Invalid id: ${req.params.productId}`
          )
        );
    }

    const cart = await Cart.updateSubTotal(
      req.user.id,
      req.params.productId,
      -quantity
    );

    Product.updateAvailibility(req.params.productId, quantity);

    res.status(200).json({
      status: 'success',
      data: cart,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ customer: req.user.id }).populate({
      path: 'items.product',
      select: 'title price shippingCost brand coverImage',
    });
    if (!cart)
      return next(
        new AppError(404, `No cart found for this user: ${req.user.id}!`)
      );

    res.status(200).json({
      status: 'success',
      data: {
        data: cart,
      },
    });
  } catch (err) {
    next(err);
  }
};
