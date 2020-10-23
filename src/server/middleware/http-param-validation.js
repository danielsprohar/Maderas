const mongoose = require('mongoose')
const httpStatusCodes = require('../constants/http-status-codes')

module.exports = function (req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.param.id)) {
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send('Invalid object id')
  }

  next()
}
