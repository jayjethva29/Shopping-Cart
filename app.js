const express = require('express');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/AppError');
const errorHandler = require('./controllers/errorHandler');
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter');
const cartRouter = require('./routes/cartRouter');
const categoryRouter = require('./routes/categoryRouter');

const app = express();

//Gloabal Middlewares
app.use(express.json());
app.use(cookieParser());

//Entry points
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/categories', categoryRouter);

app.all('*', (req, _, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(errorHandler);

module.exports = app;
