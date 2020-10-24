const express = require('express')
const errorHandler = require('../middleware/error-handler')

const auth = require('../routes/auth')
const boards = require('../routes/boards')
const lists = require('../routes/lists')
const items = require('../routes/items')

module.exports = function (app) {
  app.use(express.json())
  app.use('/api/auth', auth)
  app.use('/api/boards', boards)
  app.use('/api/lists', lists)
  app.use('/api/items', items)
  app.use(errorHandler)
}
