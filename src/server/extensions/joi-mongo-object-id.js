const Joi = require('joi')
const mongoose = require('mongoose')

module.exports = Joi.extend((joi) => {
  return {
    type: 'objectId',
    base: joi.string(),
    validate(value, helpers) {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        helpers.error('Invalid object id')
      }
    }
  }
})
