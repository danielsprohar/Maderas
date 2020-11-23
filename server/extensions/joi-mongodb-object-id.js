const Joi = require('joi')
const mongoose = require('mongoose')

module.exports = Joi.extend((joi) => {
  return {
    type: 'objectId',
    base: joi.string(),
    messages: {
      'objectId.invalid': '{{#label}} is an invalid MongoDB ObjectId'
    },
    validate(value, helpers) {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return { value, errors: helpers.error('objectId.invalid') }
      }
    }
  }
})
