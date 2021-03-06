const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { createCart } = require('../controllers/cartController');

const router = express.Router();

router.post('/singup', authController.singup, createCart);
router.post('/login', authController.login);
router.post('/logout', authController.protectRoute, authController.logout);

module.exports = router;
