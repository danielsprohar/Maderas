const { User } = require('../../../models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('dotenv').config()

describe('user.generateJwtToken', () => {
  it('should return a valid JWT token', () => {
    const payload = {
      id: new mongoose.Types.ObjectId().toHexString(),
      username: 'John Doe'
    }
    
    const user = new User({
      _id: payload.id,
      username: payload.username
    })

    const token = user.generateJwtToken()
    const decoded = jwt.verify(token, process.env.JWT_KEY)

    expect(decoded).toMatchObject(payload)
  })
})
