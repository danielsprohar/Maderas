const request = require('supertest')
const { Board } = require('../../../models/board')
const { Template } = require('../../../models/template')
const mongoose = require('mongoose')
const httpStatusCodes = require('../../../constants/http-status-codes')
const { List } = require('../../../models/list')
const { User } = require('../../../models/user')

const userId = new mongoose.Types.ObjectId().toHexString()

let server = null

// ===========================================================================

async function initializeDb() {
  const user = await User.create({
    email: 'jane_roe@example.com',
    normalizedEmail: 'jane_roe@example.com',
    password: 'password_123'
  })

  await Board.insertMany([
    {
      title: 'Board 1',
      user: user._id
    },
    {
      title: 'Board 2',
      user: user._id
    },
    {
      title: 'Board 3',
      user: user._id
    }
  ])

  return user._id.toHexString()
}

// ===========================================================================

async function clearDb() {
  await User.deleteMany()
  await Board.deleteMany()
  await List.deleteMany()
  await Template.deleteMany()
}

// ===========================================================================

async function createNotFoundRequest() {
  const id = new mongoose.Types.ObjectId().toHexString()
  const res = await request(server).get(`/api/boards/${id}`)
  expect(res.status).toBe(httpStatusCodes.notFound)
}

// ===========================================================================
// Top-level test suite
// ===========================================================================
describe('/api/boards', () => {
  beforeEach(() => {
    server = require('../../../app')
  })

  afterEach(async () => {
    await clearDb()
    if (server) {
      await server.close()
    }
  })

  // =========================================================================
  // Test suite
  // =========================================================================
  describe('GET /', () => {
    it("should return 400 if an invalid id is provided for the 'user' query param", async () => {
      const res = await request(server).get('/api/boards?user=1')
      expect(res.status).toBe(httpStatusCodes.badRequest)
    })

    it('should return a paginated list of boards', async () => {
      // Setup
      await initializeDb()

      // Test
      const res = await request(server).get('/api/boards')
      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body['data'].length).toBeGreaterThan(1)
    })

    it('should return a paginated list of boards that are associated with a given user', async () => {
      // Setup
      const userId = await initializeDb()

      // Test
      const res = await request(server).get(`/api/boards?user=${userId}`)
      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body['data'].length).toBeGreaterThan(1)
    })
  })

  // =========================================================================

  describe('GET /:id', () => {
    it(
      'should return HTTP status 404 for a board that does not exist',
      createNotFoundRequest
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
      const token = new User().generateAuthToken()
      const res = await request(server)
        .post('/api/boards')
        .set('Authorization', `Bearer ${token}`)
        .send({})

      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it('should return HTTP status 201 upon successful creation of a new Board', async () => {
      const token = new User().generateAuthToken()
      const payload = {
        title: 'test',
        user: userId
      }

      const res = await request(server)
        .post('/api/boards')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)

      expect(res.status).toBe(httpStatusCodes.created)
      expect(res.body).toBeTruthy()
      expect(res.body).toMatchObject(payload)
    })
  })

  // =========================================================================

  describe('PUT /:id', () => {
    it(
      'should return HTTP status 404 for a board that does not exist',
      createNotFoundRequest
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
      'should return HTTP status 404 for a board that does not exist',
      createNotFoundRequest
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

    it(
      'should return HTTP status 404 for a board that does not exist',
      createNotFoundRequest
    )

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
