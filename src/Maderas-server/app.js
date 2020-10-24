require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const winston = require('./config/winston')
const express = require('express')
const app = express()
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
// Middleware
// ======================================================

app.use(
  cors({
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
)

app.use(helmet())
app.use(morgan('dev'))

// ======================================================
// Start the server
// ======================================================

const port = process.env.PORT || 5000
app.listen(port, () => {
  winston.info('Now listening on port ' + port)
})
