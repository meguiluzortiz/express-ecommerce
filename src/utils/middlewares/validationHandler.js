const joi = require('joi');
const boom = require('@hapi/boom');

function validate(data, schema) {
  const { error } = joi.validate(data, schema);
  return error;
}

function validationHandler(schema, check = 'body') {
  return function (req, _, next) {
    const error = validate(req[check], schema);
    return error ? next(boom.badRequest(error)) : next();
  };
}

module.exports = validationHandler;
