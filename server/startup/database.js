const winston = require('../logger/winston')
const mongoose = require('mongoose')

module.exports = function () {
  const uri =
    process.env.NODE_ENV === 'production'
      ? process.env.MONGODB_URI
      : process.env.TEST_MONGODB_URI

  mongoose
    .connect(uri, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // https://mongoosejs.com/docs/guide.html#indexes
      autoIndex: false
    })
    .then(() => winston.info('Connected to MongoDB'))
}
