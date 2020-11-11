const winston = require('../logger/winston')
const mongoose = require('mongoose')

module.exports = function () {
  const uri =
    process.env.NODE_ENV === 'production'
      ? process.env.DB_URI
      : process.env.TEST_DB_URI

  mongoose
    .connect(uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
      // autoIndex: false
    })
    .then(() => winston.info(`Connect to database located at ${uri}`))
}
