const winston = require('./logger/winston')
const express = require('express')
const app = express()
require('dotenv').config()
require('./startup/middleware')(app)
require('./startup/routes')(app)
require('./startup/database')()

// ===========================================================================
// Logging
// ===========================================================================

// Catch rejected promises
process.on('unhandledRejection', (err) => {
  // Let winston take care of the rest
  throw err
})

// ======================================================
// Start the server
// ======================================================

const port = process.env.PORT || 8080
const server = app.listen(port, () => {
  winston.info('Now listening on port ' + port)
})

module.exports = server
