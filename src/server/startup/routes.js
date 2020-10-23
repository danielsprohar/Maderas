const express = require('express')
const errorHandler = require('../middleware/error-handler')

const auth = require('../routes/auth')
const boards = require('../routes/boards')

module.exports = function (app) {
  app.use(express.json())
  app.use('/api/auth', auth)
  app.use('/api/boards', boards)
  app.use(errorHandler)
}
