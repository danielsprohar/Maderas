const express = require('express')
const errorHandler = require('../middleware/error-handler')

const auth = require('../routes/auth')

module.exports = function (app) {
  app.use(express.json())
  app.use('/api/auth', auth)
  app.use(errorHandler)
}
