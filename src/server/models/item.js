const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('../extensions/joi-mongodb-object-id')

// ===========================================================================

// TODO: Get rid of this constraint.
const yesterday = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24)

// ===========================================================================

const itemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 512,
      trim: true
    },
    description: {
      type: String,
      maxlength: 2048,
      trim: true
    },
    dueDate: {
      type: Date,
      min: yesterday
    },
    list: {
      type: mongoose.Types.ObjectId,
      ref: 'List'
    }
  },
  {
    timestamps: true
  }
)

// ===========================================================================

function validate(reqBody) {
  const schema = Joi.object({
    title: Joi.string().max(512).required(),
    description: Joi.string().max(2048).allow(''),
    dueDate: Joi.date().min(yesterday),
    list: Joi.objectId().required()
  })

  return schema.validate(reqBody)
}

// ===========================================================================

exports.Item = mongoose.model('Item', itemSchema)
exports.validate = validate
