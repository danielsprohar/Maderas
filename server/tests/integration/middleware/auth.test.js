const request = require('supertest')
const { User } = require('../../../models/user')
const mongoose = require('mongoose')
const httpStatusCodes = require('../../../constants/http-status-codes')

let server = null

describe('auth middlware', () => {
  beforeEach(() => {
    server = require('../../../app')
  })

  afterEach(async () => {
    if (server) {
      await server.close()
    }
  })

  it('should return 401 if no token is provided', async () => {
    const res = await request(server)
      .post('/api/boards')
      .send({ title: 'Test board', user: new mongoose.Types.ObjectId() })

    expect(res.status).toBe(httpStatusCodes.unauthorized)
  })

  it('should return 400 for an invalid Authorization header value', async () => {
    const token = new User().generateAuthToken()

    const res = await request(server)
      .post('/api/boards')
      .set('Authorization', `${token}`)
      .send({ title: 'Test board', user: new mongoose.Types.ObjectId() })

    expect(res.status).toBe(httpStatusCodes.badRequest)
  })

  it('should return 400 for an invalid Authorization header value', async () => {
    const token = ''

    const res = await request(server)
      .post('/api/boards')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test board', user: new mongoose.Types.ObjectId() })

    expect(res.status).toBe(httpStatusCodes.unauthorized)
  })
})
