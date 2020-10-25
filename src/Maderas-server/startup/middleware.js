const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')

module.exports = function (app) {
  app.use(
    cors({
      origin: 'http://localhost:4200',
      optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    })
  )

  app.use(helmet())
  app.use(morgan('dev'))
}
