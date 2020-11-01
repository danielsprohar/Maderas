const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('../extensions/joi-mongodb-object-id')

// ===========================================================================

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 512,
      trim: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'List'
      }
    ]
  },
  {
    timestamps: true
  }
)

// ===========================================================================

function validate(reqBody) {
  const schema = Joi.object({
    title: Joi.string().max(512).required(),
    user: Joi.objectId().required()
  })

  return schema.validate(reqBody)
}

// ===========================================================================

exports.Board = mongoose.model('Board', boardSchema)
exports.validate = validate
