require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const mongoose = require('mongoose')
const winston = require('./config/winston')
const express = require('express')
const app = express()

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

const corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(helmet())
app.use(morgan('dev'))

// ======================================================
// Routes
// ======================================================

// ======================================================
// Connect to the database
// ======================================================

mongoose
  .connect(process.env.DB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
    // autoIndex: false
  })
  .then(() => winston.info('Connected to MongoDB'))
  .catch((reason) => winston.error('Could not connect to MongoDB', reason))

// ======================================================
// Start the server
// ======================================================

const port = process.env.PORT || 5000
app.listen(port, () => {
  winston.info('Now listening on port ' + port)
})
