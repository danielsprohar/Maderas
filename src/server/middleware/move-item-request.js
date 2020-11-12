const mongoose = require('mongoose')
const httpStatusCodes = require('../constants/http-status-codes')

module.exports = function (req, res, next) {
  if (!req.query.src) {
    return res
      .status(httpStatusCodes.badRequest)
      .send('You must provide the id of the source List.')
  }
  if (!req.query.dest) {
    return res
      .status(httpStatusCodes.badRequest)
      .send('You must provide the id of the destination List.')
  }
  if (!mongoose.Types.ObjectId.isValid(req.query.src)) {
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send("Invalid object id: 'src'")
  }
  if (!mongoose.Types.ObjectId.isValid(req.query.dest)) {
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send("Invalid object id: 'dest'")
  }

  next()
}
