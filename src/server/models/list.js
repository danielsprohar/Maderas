const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('../extensions/joi-mongodb-object-id')

// ===========================================================================

const listSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 512
  },
  board: {
    type: mongoose.Types.ObjectId,
    ref: 'Board'
  },
  items: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Item'
    }
  ]
})

// ===========================================================================

function validate(reqBody) {
  const schema = Joi.object({
    title: Joi.string().max(512).required(),
    board: Joi.objectId().required()
  })

  return schema.validate(reqBody)
}

// ===========================================================================

exports.List = mongoose.model('List', listSchema)
exports.validate = validate
