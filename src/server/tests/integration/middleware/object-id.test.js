const request = require('supertest')
const httpStatusCodes = require('../../../constants/http-status-codes')
const mongoose = require('mongoose')
const { Board } = require('../../../models/board')

let server = null

describe('validate-object-id middleware', () => {
  beforeEach(() => {
    server = require('../../../app')
  })

  afterEach(async () => {
    await Board.deleteMany()
    if (server) {
      await server.close()
    }
  })

  it('should return 422 if an invalid object id is provided', async () => {
    const res = await request(server).get('/api/boards/1')
    expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
  })

  it('should return 200 if a valid object id is provided', async () => {
    const board = await Board.create({
      title: 'Test board',
      user: new mongoose.Types.ObjectId()
    })

    const res = await request(server).get(`/api/boards/${board._id}`)
    expect(res.status).toBe(httpStatusCodes.ok)
  })
})
