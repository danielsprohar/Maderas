const mongoose = require('mongoose')
const httpStatusCodes = require('../constants/http-status-codes')

module.exports = function (req, res, next) {
  console.log(req.params.id)
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send('Invalid object id')
  }

  next()
}
