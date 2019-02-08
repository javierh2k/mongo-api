const Joi = require('joi');

const queryUser = {
  query: {
    page: Joi.number().required(),
    limit: Joi.number(),
    price_from: Joi.number(),
    price_to: Joi.number(),
  },
};

module.exports = queryUser;
