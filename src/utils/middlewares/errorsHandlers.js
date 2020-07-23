const boom = require('@hapi/boom');
const debug = require('debug')('app:error');
const { config } = require('../../config');
const isRequestAjaxOrApi = require('../../utils/isRequestAjaxOrApi');

function withErrorStack(err, stack) {
  if (config.dev) {
    return { ...err, stack }; // Object.assign({}, err, stack)
  }
}

function logErrors(err, _, _, next) {
  debug(err.stack);
  return next(err);
}

function wrapErrors(err, _, _, next) {
  if (!err.isBoom) {
    return next(boom.badImplementation(err));
  }

  return next(err);
}

function clientErrorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload },
  } = err;

  // catch errors for AJAX request or if an error ocurrs while streaming
  if (isRequestAjaxOrApi(req) || res.headersSent) {
    return res.status(statusCode).json(withErrorStack(payload, err.stack));
  }

  return next(err);
}

function errorHandler(err, req, res, next) {
  const {
    output: { statusCode, payload },
  } = err;

  res.status(statusCode);
  res.render('error', withErrorStack(payload, err.stack));
}

module.exports = {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  errorHandler,
};
