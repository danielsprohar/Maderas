const mongoose = require('mongoose')
const httpStatusCodes = require('../constants/http-status-codes')

module.exports = function (req, res, next) {
  if (!req.query.from) {
    return res
      .status(httpStatusCodes.badRequest)
      .send('You must specify the list from which the item originates from.')
  }
  if (!req.query.to) {
    return res
      .status(httpStatusCodes.badRequest)
      .send('You must specify the list for which the item is destined to.')
  }
  if (!mongoose.Types.ObjectId.isValid(req.query.from)) {
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send("Invalid object id: 'from'")
  }
  if (!mongoose.Types.ObjectId.isValid(req.query.to)) {
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send("Invalid object id: 'to'")
  }

  next()
}
