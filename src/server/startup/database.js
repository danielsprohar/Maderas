const winston = require('../config/winston')
const mongoose = require('mongoose')

module.exports = function () {
  mongoose
    .connect(process.env.DB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
      // autoIndex: false
    })
    .then(() => winston.info('Connected to MongoDB'))
}
