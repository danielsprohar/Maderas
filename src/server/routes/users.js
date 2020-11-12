const express = require('express')
const router = express.Router()
const { User } = require('../models/user')

// ===========================================================================

// ===========================================================================

router.get('/search', async (req, res) => {
  if (!req.query.email) {
    return res.json([])
  }

  // TODO: Finish this
  const count = await User.countDocuments({
    normalizedEmail: new String(req.query.email).trim().toLocaleUpperCase()
  })

  res.json(count)
})

// ===========================================================================

module.exports = router
