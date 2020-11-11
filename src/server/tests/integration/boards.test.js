const request = require('supertest')

let server = null

describe('/api/boards', () => {
  beforeEach(() => {
    server = require('../../app')
  })

  afterEach(() => {
    if (server) {
      server.close()
    }
  })

  describe('GET /', () => {
    it('should return a paginated list of boards', async () => {
      const res = await request(server).get('/api/boards')
      expect(res.status).toBe(200)
    })
  })
})
