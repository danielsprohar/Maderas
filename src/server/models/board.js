const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

// ===========================================================================

const boardSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 512
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
})

// ===========================================================================

function validate(reqBody) {
  const schema = Joi.object({
    title: Joi.string().max(512).required(),
    userId: Joi.string().required()
  })

  return schema.validate(reqBody)
}

// ===========================================================================

exports.Board = mongoose.model('Board', boardSchema)
exports.validate = validate
