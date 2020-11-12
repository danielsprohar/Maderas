const request = require('supertest')
const { Board } = require('../../models/board')
const { Template } = require('../../models/template')
const mongoose = require('mongoose')
const httpStatusCodes = require('../../constants/http-status-codes')

const userId = new mongoose.Types.ObjectId().toHexString()

let server = null

// ===========================================================================

async function initializeDb() {
  await Board.insertMany([
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
  await Board.deleteMany({})
}

// ===========================================================================

async function createInvalidObjectIdRequest() {
  const res = await request(server).get('/api/boards/1')
  expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
}

// ===========================================================================

async function createBoardNotFoundRequest() {
  const id = new mongoose.Types.ObjectId().toHexString()
  const res = await request(server).get(`/api/boards/${id}`)
  expect(res.status).toBe(httpStatusCodes.notFound)
}

// ===========================================================================
// Top-level test suite
// ===========================================================================
describe('/api/boards', () => {
  beforeEach(async () => {
    server = require('../../app')
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
      await initializeDb()
      const res = await request(server).get('/api/boards')

      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body['data'].length).toBeGreaterThan(1)
    })
  })

  // =========================================================================

  describe('GET /:id', () => {
    it(
      'should return HTTP status 422 for an invalid object id',
      createInvalidObjectIdRequest
    )

    it(
      'should return HTTP status 404 for a board that does not exist',
      createBoardNotFoundRequest
    )

    it('should return HTTP status 200 for a board that exists', async () => {
      const board = new Board({ title: 'test', user: userId })
      await board.save()

      const res = await request(server).get(`/api/boards/${board._id}`)
      expect(res.status).toBe(httpStatusCodes.ok)
    })
  })

  // =========================================================================

  describe('POST /', () => {
    it('should return HTTP status 422 for an invalid request body', async () => {
      const res = await request(server).post('/api/boards').send({})
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it('should return HTTP status 201 upon successful creation of a new', async () => {
      const payload = {
        title: 'test',
        user: userId
      }

      const res = await request(server).post('/api/boards').send(payload)
      expect(res.status).toBe(httpStatusCodes.created)
      expect(res.body).toBeTruthy()
      expect(res.body).toMatchObject(payload)
    })
  })

  // =========================================================================

  describe('PUT /:id', () => {
    it(
      'should return HTTP status 422 for an invalid object id',
      createInvalidObjectIdRequest
    )

    it(
      'should return HTTP status 404 for a board that does not exist',
      createBoardNotFoundRequest
    )

    it('should return HTTP status 422 for an invalid request body', async () => {
      const board = new Board({ title: 'test', user: userId })
      await board.save()
      const url = `/api/boards/${board._id}`
      const res = await request(server).put(url).send({})
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it('should update a board and return said board', async () => {
      const board = new Board({ title: 'test', user: userId })
      await board.save()

      const url = `/api/boards/${board._id}`
      const payload = {
        title: 'test (edit)',
        user: userId
      }

      const res = await request(server).put(url).send(payload)
      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body).toBeTruthy()
      expect(res.body).toMatchObject(payload)
    })
  })

  // =========================================================================

  describe('DELETE /:id', () => {
    it(
      'should return HTTP status 422 for an invalid object id',
      createInvalidObjectIdRequest
    )

    it(
      'should return HTTP status 404 for a board that does not exist',
      createBoardNotFoundRequest
    )

    it('should delete a board and all of its related documents', async () => {
      const board = new Board({ title: 'test', user: userId })
      await board.save()

      const url = `/api/boards/${board._id}`
      const res = await request(server).delete(url)
      expect(res.status).toBe(httpStatusCodes.noContent)
    })
  })

  // =========================================================================

  describe('POST /create-from/template/:id', () => {
    it('should return HTTP status 422 for an invalid request body', async () => {
      const id = new mongoose.Types.ObjectId().toHexString()
      const url = `/api/boards/create-from/template/${id}`
      const res = await request(server).post(url).send({})
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it('should return HTTP status 422 for an invalid object id', async () => {
      const url = '/api/boards/create-from/template/1'
      const payload = {
        title: 'test',
        user: userId
      }

      const res = await request(server).post(url).send(payload)
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it('should return HTTP status 404 for a board that does not exist', async () => {})

    it('should create a new board from an existing template', async () => {
      const template = new Template({
        name: 'Kanban',
        lists: [
          { title: 'Backlog' },
          { title: 'Design' },
          { title: 'To-Do' },
          { title: 'In progress' },
          { title: 'Code Review' },
          { title: 'Testing' },
          { title: 'Done' }
        ]
      })

      await template.save()

      const url = `/api/boards/create-from/template/${template._id}`
      const payload = {
        title: 'test',
        user: userId
      }

      const res = await request(server).post(url).send(payload)
      expect(res.status).toBe(httpStatusCodes.created)
      expect(res.body).toBeTruthy()
      expect(res.body).toMatchObject(payload)
    })
  })
})
