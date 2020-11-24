const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Joi = require('joi')
const jwt = require('jsonwebtoken')

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
      required: true,
      uppercase: true,
      index: {
        unique: true
      }
    },
    // https://www.npmjs.com/package/bcrypt#hash-info
    password: {
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
function validate(requestBody) {
  const schema = Joi.object({
    username: Joi.string(),
    email: Joi.string().regex(emailRegex).required(),
    password: Joi.string().min(6).required()
  })

  return schema.validate(requestBody)
}

// ===========================================================================

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this.id,
      username: this.username
    },
    process.env.JWT_KEY,
    {
      expiresIn: '1h',
      issuer: process.env.ISSUER,
      audience: process.env.AUDIENCE,
      subject: this.id
    }
  )
}

// ===========================================================================

exports.User = mongoose.model('User', userSchema)
exports.validate = validate
