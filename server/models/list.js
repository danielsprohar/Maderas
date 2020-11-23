const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('../extensions/joi-mongodb-object-id')

// ===========================================================================

const listSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 512,
    trim: true
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

/**
 * Validates the request body when the user requests the creation of a new `List`.
 * @param {*} reqBody The request body of a HTTP POST request.
 */
function validate(reqBody) {
  const schema = Joi.object({
    title: Joi.string().max(512).required(),
    board: Joi.objectId().required()
  })

  return schema.validate(reqBody)
}

/**
 * Validates the request body when the user requests to move a single `Item`
 * within a given `List`.
 * @param {*} reqBody The request body of a HTTP PUT request.
 */
function validateMoveItemRequest(reqBody) {
  const schema = Joi.object({
    itemId: Joi.objectId().required(),
    destinationIndex: Joi.number().required()
  })

  return schema.validate(reqBody)
}

// ===========================================================================

exports.List = mongoose.model('List', listSchema)
exports.validate = validate
exports.validateMoveItemRequest = validateMoveItemRequest
