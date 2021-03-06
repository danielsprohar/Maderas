const express = require('express')
const router = express.Router()
const winston = require('../logger/winston')
const bcrypt = require('bcrypt')
const httpStatusCodes = require('../constants/http-status-codes')
const { User, validate } = require('../models/user')

const saltRounds = 11

// ===========================================================================
// Login
// ===========================================================================

router.post('/login', async (req, res, next) => {
  const { error } = validate(req.body)
  if (error) {
    winston.warn(error)
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send(error.details[0].message)
  }

  try {
    // Check the validity of the email.
    const user = await User.findOne({
      normalizedEmail: req.body.email.toUpperCase()
    })

    if (!user) {
      return res
        .status(httpStatusCodes.unauthorized)
        .send('Invalid email or password')
    }

    // Check the validity of the password.
    const isAuthorized = await bcrypt.compare(req.body.password, user.password)

    if (!isAuthorized) {
      return res
        .status(httpStatusCodes.unauthorized)
        .send('Invalid email or password')
    }

    winston.info(
      `User login successful: User(_id: ${user._id}, email: ${user.email})`
    )

    // Good to go!
    res.json(buildResponse(user))
  } catch (e) {
    next(e)
  }
})

// ===========================================================================
// Register
// ===========================================================================

router.post('/register', async (req, res, next) => {
  const { error } = validate(req.body)
  if (error) {
    winston.warn(error)
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send(error.details[0].message)
  }

  try {
    const hash = await bcrypt.hash(req.body.password, saltRounds)

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      normalizedEmail: req.body.email.toUpperCase(),
      password: hash
    })

    await user.save()

    winston.info(
      `A new user was created: User(_id: ${user._id}, email: ${user.email})`
    )

    res.json(buildResponse(user))
  } catch (e) {
    next(e)
  }
})

// ===========================================================================
// Facilitators
// ===========================================================================

function buildResponse(userDoc) {
  return {
    user: {
      id: userDoc._id,
      email: userDoc.email,
      username: userDoc.username
    },
    token: userDoc.generateAuthToken()
  }
}

// ===========================================================================

module.exports = router
