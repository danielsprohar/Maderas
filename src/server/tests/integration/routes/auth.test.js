const request = require('supertest')
const httpStatusCodes = require('../../../constants/http-status-codes')
const bcrypt = require('bcrypt')
const { User } = require('../../../models/user')

async function initializeDb() {
  const saltRounds = 11
  await User.insertMany([
    {
      email: 'abc@example.com',
      normalizedEmail: 'abc@example.com'.toUpperCase(),
      password: await bcrypt.hash('password_123', saltRounds)
    },
    {
      email: 'bcd@example.com',
      normalizedEmail: 'bcd@example.com'.toUpperCase(),
      password: Math.random().toString(36).substr(2)
    },
    {
      email: 'cde@example.com',
      normalizedEmail: 'cde@example.com'.toUpperCase(),
      password: Math.random().toString(36).substr(2)
    }
  ])
}

// ===========================================================================

async function clearDb() {
  await User.deleteMany()
}

// ===========================================================================
// Test suite
// ===========================================================================

describe('/api/auth', () => {
  let server = null

  beforeEach(() => {
    server = require('../../../app')
  })

  // =========================================================================

  afterEach(async () => {
    await clearDb()
    if (server) {
      await server.close()
    }
  })

  // =========================================================================
  // Test the "login" endpoint
  // =========================================================================
  describe('POST /login', () => {
    // =======================================================================
    // Invalid request body
    // =======================================================================
    it("should return 422 if the user's email is not provided", async () => {
      // Setup
      const payload = {
        password: 'password'
      }

      // Test
      const res = await request(server).post('/api/auth/login').send(payload)
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it("should return 422 if the user's password is not provided", async () => {
      // Setup
      const payload = {
        email: 'email@example.com'
      }

      // Test
      const res = await request(server).post('/api/auth/login').send(payload)
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    // =======================================================================
    // Invalid password
    // =======================================================================
    it('should return 401 if an invalid password if provided', async () => {
      // Setup
      await initializeDb()
      const payload = {
        email: 'abc@example.com',
        password: 'password'
      }

      // Test
      const res = await request(server).post('/api/auth/login').send(payload)
      expect(res.status).toBe(httpStatusCodes.unauthorized)
    })

    // =======================================================================
    // Invalid email
    // =======================================================================
    it('should return 401 if an invalid email is provided', async () => {
      // Setup
      await initializeDb()
      const payload = {
        email: 'abcdefg@example.com',
        password: 'password_123'
      }

      // Test
      const res = await request(server).post('/api/auth/login').send(payload)
      expect(res.status).toBe(httpStatusCodes.unauthorized)
    })

    // =======================================================================
    // All systems go!
    // =======================================================================
    it('should return 200 with an access token and a user object', async () => {
      // Setup
      await initializeDb()
      const payload = {
        email: 'abc@example.com',
        password: 'password_123'
      }

      // Test
      const res = await request(server).post('/api/auth/login').send(payload)
      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body.user.id).toBeDefined()
      expect(res.body.user.email).toEqual(payload.email)
      expect(res.body.token).toBeDefined()
    })
  })

  // =========================================================================
  // Test the "register" endpoint
  // =========================================================================
  describe('POST /register', () => {
    // =======================================================================
    // Invalid request body
    // =======================================================================
    it("should return 422 if the user's email is not provided", async () => {
      // Setup
      const payload = {
        password: 'password'
      }

      // Test
      const res = await request(server).post('/api/auth/register').send(payload)
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it("should return 422 if the user's password is not provided", async () => {
      // Setup
      const payload = {
        email: 'email@example.com'
      }

      // Test
      const res = await request(server).post('/api/auth/register').send(payload)
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    // =======================================================================
    // All systems go!
    // =======================================================================
    it('should return 200 with an access token and a user object', async () => {
      // Setup
      const payload = {
        email: 'i_am_batman@gotham.gov',
        password: 'the_joker_did_nothing_wrong'
      }

      // Test
      const res = await request(server).post('/api/auth/register').send(payload)
      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body.user.id).toBeDefined()
      expect(res.body.user.email).toEqual(payload.email)
      expect(res.body.token).toBeDefined()
    })
  })
})
