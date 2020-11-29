const request = require('supertest')
const httpStatusCodes = require('../../../constants/http-status-codes')
const { User } = require('../../../models/user')

let server = null

async function initializeDb() {
  await User.insertMany([
    {
      email: 'abc@example.com',
      normalizedEmail: 'abc@example.com'.toUpperCase(),
      password: Math.random().toString(36).substr(2)
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

describe('/api/users', () => {
  beforeEach(() => {
    server = require('../../../server')
  })

  // =========================================================================

  afterEach(async () => {
    await clearDb()
    if (server) {
      await server.close()
    }
  })

  // =========================================================================

  it('should return 0 in the response body if an email is not provided', async () => {
    // Setup
    await initializeDb()

    // Test
    const url = '/api/users/email-count'
    const res = await request(server).get(url)
    expect(res.status).toBe(httpStatusCodes.ok)
    expect(res.body).toBeDefined()
    expect(res.body).toBe(0)
  })

  // =========================================================================

  it('should return 0 in the response body if the given email does not exist', async () => {
    // Setup
    await initializeDb()

    // Test
    const url = '/api/users/email-count?email=john@gmail.com'
    const res = await request(server).get(url)
    expect(res.status).toBe(httpStatusCodes.ok)
    expect(res.body).toBeDefined()
    expect(res.body).toBe(0)
  })

  // =========================================================================

  it('should return 1 in the response body if the given email exists', async () => {
    // Setup
    await initializeDb()

    // Test
    const url = '/api/users/email-count?email=cde@example.com'
    const res = await request(server).get(url)
    expect(res.status).toBe(httpStatusCodes.ok)
    expect(res.body).toBeDefined()
    expect(res.body).toBe(1)
  })
})
