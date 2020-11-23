const request = require('supertest')
const httpStatusCodes = require('../../../constants/http-status-codes')
const mongoose = require('mongoose')
const { Board } = require('../../../models/board')
const { Template } = require('../../../models/template')

async function clearDb() {
  await Board.deleteMany()
  await Template.deleteMany()
}

// =========================================================================

async function initializeDb() {
  await Template.create({
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
}

// =========================================================================

let server = null

describe('/api/templates', () => {
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

  describe('GET /is-available', () => {
    it("should return 400 if the 'name' query param is not provided", async () => {
      const res = await request(server).get('/api/templates/is-available')
      expect(res.status).toBe(httpStatusCodes.badRequest)
    })

    it("should return 'false' if the template name is unavailable", async () => {
      // Setup
      await initializeDb()

      // Test
      const url = '/api/templates/is-available?name=Kanban'
      const res = await request(server).get(url)
      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body).toEqual(false)
    })

    it("should return 'true' if the template name is available", async () => {
      const url = '/api/templates/is-available?name=Batman'
      const res = await request(server).get(url)
      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body).toEqual(true)
    })
  })

  // =========================================================================

  describe('GET /', () => {
    it('should return a paginated response', async () => {
      // Setup
      await initializeDb()

      // Test
      const res = await request(server).get('/api/templates')
      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body.pageIndex).toBeDefined()
      expect(res.body.pageSize).toBeDefined()
      expect(res.body.count).toBeDefined()
      expect(res.body.data).toBeDefined()
      expect(res.body.data.length).toBeGreaterThan(0)
    })
  })

  // =========================================================================

  describe('GET /:id', () => {
    it('should return 404 if the template does not exist', async () => {
      const id = new mongoose.Types.ObjectId()
      const url = `/api/templates/${id}`

      // Test
      const res = await request(server).get(url)
      expect(res.status).toBe(httpStatusCodes.notFound)
    })

    it('should return 200 and a Template', async () => {
      // Setup
      const template = {
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
      }

      const templateDoc = await Template.create(template)

      // Test
      const res = await request(server).get(`/api/templates/${templateDoc._id}`)
      expect(res.status).toBe(httpStatusCodes.ok)
    })
  })

  // =========================================================================
  describe('POST /', () => {
    it('should return 422 for an invalid request body', async () => {
      // Setup
      const payload = {
        name: 'Kanban'
      }

      // Test
      const res = await request(server)
        .post('/api/templates')
        // .set('Authorization', `Bearer ${token}`)
        .send(payload)

      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it('should return 422 if the given template name is not available', async () => {
      // Setup
      await initializeDb()

      const payload = {
        name: 'Kanban',
        user: new mongoose.Types.ObjectId().toHexString(),
        lists: [
          { title: 'Backlog' },
          { title: 'Design' },
          { title: 'To-Do' },
          { title: 'In progress' },
          { title: 'Code Review' },
          { title: 'Testing' },
          { title: 'Done' }
        ]
      }

      // Test
      const res = await request(server)
        .post('/api/templates')
        // .set('Authorization', `Bearer ${token}`)
        .send(payload)

      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it('should return 201 if the template was created', async () => {
      // Setup
      const payload = {
        name: 'Minimal',
        user: new mongoose.Types.ObjectId().toHexString(),
        lists: [
          { title: 'Design' },
          { title: 'To-Do' },
          { title: 'In progress' },
          { title: 'Testing' },
          { title: 'Done' }
        ]
      }

      // Test
      const res = await request(server)
        .post('/api/templates')
        // .set('Authorization', `Bearer ${token}`)
        .send(payload)

      expect(res.status).toBe(httpStatusCodes.created)
      expect(res.body).toBeDefined()
    })
  })
})
