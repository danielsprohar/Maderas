const request = require('supertest')
const { Board } = require('../../models/board')
const mongoose = require('mongoose')
const httpStatusCodes = require('../../constants/http-status-codes')

const userId = new mongoose.Types.ObjectId().toHexString()

let server = null

// ===========================================================================

async function initializeDb() {
  await Board.collection.insertMany([
    {
      title: 'Board 1',
      user: userId
    },
    {
      title: 'Board 2',
      user: userId
    },
    {
      title: 'Board 3',
      user: userId
    }
  ])
}

// ===========================================================================

async function clearDb() {
  await Board.collection.deleteMany({})
}

// ===========================================================================
// Top-level test suite
// ===========================================================================
describe('/api/boards', () => {
  beforeEach(async () => {
    server = require('../../app')
    await initializeDb()
  })

  afterEach(async () => {
    if (server) {
      server.close()
    }
    await clearDb()
  })

  // =========================================================================
  // Test suite
  // =========================================================================
  describe('GET /', () => {
    it('should return a paginated list of boards', async () => {
      const res = await request(server).get('/api/boards')
      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body['data'].length).toBe(3)
    })
  })

  // =========================================================================

  describe('GET /:id', () => {
    it('should return HTTP status 422 for an invalid object id', async () => {
      const res = await request(server).get('/api/boards/1')
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it('should return HTTP status 404 for a board that does not exist', async () => {
      const id = new mongoose.Types.ObjectId().toHexString()
      const res = await request(server).get(`/api/boards/${id}`)
      expect(res.status).toBe(httpStatusCodes.notFound)
    })

    it('should return HTTP status 200 for a board that exists', async () => {
      const board = new Board({ title: 'test', user: userId })
      await board.save()

      const res = await request(server).get(`/api/boards/${board._id}`)
      expect(res.status).toBe(httpStatusCodes.ok)
    })
  })

  // =========================================================================
})
