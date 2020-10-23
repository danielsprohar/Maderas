const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

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
  }
})

// ===========================================================================

function validate(reqBody) {
  const schema = Joi.object({
    title: Joi.string().max(512).required(),
    boardId: Joi.string().required()
  })

  return schema.validate(reqBody)
}

// ===========================================================================

exports.List = mongoose.model('List', listSchema)
exports.validate = validate
