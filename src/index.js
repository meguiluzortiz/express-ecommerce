const express = require('express');
const path = require('path');
const debug = require('debug')('app:server');
const helmet = require('helmet');
const cors = require("cors");
const { config } = require('./config');
const productsRouter = require('./routes/views/products');
const productsApiRouter = require('./routes/api/products');
const authApiRouter = require('./routes/api/auth');

const { logErrors, wrapErrors, clientErrorHandler, errorHandler } = require('./utils/middlewares/errorsHandlers');
const notFoundHandler = require('./utils/middlewares/notFoundHandler');

// app
const app = express();

// middlewares
app.use(cors({ origin: config.clientOrigin }));
app.use(helmet());
app.use(express.json());

// static files
app.use('/static', express.static(path.join(__dirname, '../', 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// routes
app.use('/products', productsRouter);
productsApiRouter(app);
app.use('/api/auth', authApiRouter);

// redirect
app.get('/', function (req, res) {
  res.redirect('/products');
});

// 404
app.use(notFoundHandler);

// error handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// server
const server = app.listen(config.serverPort, function () {
  debug(`Listening http://localhost:${server.address().port}`);
});
