const express = require('express')
const router = express.Router()
const { User } = require('../models/user')

/**
 * Used to determine if the given email already exists in the db.
 */
router.get('/email-count', async (req, res) => {
  if (!req.query.email) {
    return res.json(0)
  }

  const count = await User.countDocuments({
    normalizedEmail: new String(req.query.email).trim().toLocaleUpperCase()
  })

  res.json(count)
})

// ===========================================================================

module.exports = router
