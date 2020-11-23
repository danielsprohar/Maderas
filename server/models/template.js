const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('../extensions/joi-mongodb-object-id')

// ===========================================================================

const templateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 512,
      trim: true,
      lowercase: true,
      index: {
        unique: true
      }
    },
    description: {
      type: String,
      maxlength: 2048,
      trim: true
    },
    lists: [
      {
        title: {
          type: String,
          required: true,
          minlength: 1,
          maxlength: 512,
          trim: true
        }
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
    name: Joi.string().max(512).required(),
    lists: Joi.array().min(1).required(),
    user: Joi.objectId().required(),
    description: Joi.string().max(2048)
  })

  return schema.validate(reqBody)
}

// ===========================================================================

exports.Template = mongoose.model('Template', templateSchema)
exports.validate = validate
