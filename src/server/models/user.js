const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')

/**
 * Regex pattern for valid email address.
 * @see https://www.w3resource.com/javascript/form/email-validation.php
 */
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

// ===========================================================================

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255,
      trim: true
    },
    email: {
      type: String,
      required: true,
      maxlength: 255,
      validate: emailRegex,
      trim: true
    },
    normalizedEmail: {
      type: String,
      set: function () {
        return this.email.toUpperCase()
      },
      index: {
        unique: true
      }
    },
    // https://www.npmjs.com/package/bcrypt#hash-info
    hashedPassword: {
      type: String,
      minlength: 6,
      maxlength: 64
    }
  },
  {
    timestamps: true
  }
)

// ===========================================================================

/**
 * Validates the request body of a HTTP POST request for a User model.
 * @param {*} requestBody The request body of a HTTP POST request.
 */
function validateUserDoc(requestBody) {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().regex(emailRegex).required(),
    password: Joi.string().min(6).required()
  })

  return schema.validate(requestBody)
}

// ===========================================================================

exports.User = mongoose.model('User', userSchema)
exports.validateUserDoc = validateUserDoc
