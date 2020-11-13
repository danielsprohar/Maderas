const request = require('supertest')
const httpStatusCodes = require('../../../constants/http-status-codes')
const mongoose = require('mongoose')

let server = null

describe('move-item-request middleware', () => {
  beforeEach(() => {
    server = require('../../../app')
  })

  afterEach(async () => {
    if (server) {
      await server.close()
    }
  })

  it("should return HTTP status 422 for an invalid object id for 'src'", async () => {
    // Setup
    const id = new mongoose.Types.ObjectId().toHexString()
    const src = 1
    const dest = new mongoose.Types.ObjectId().toHexString()
    const url = `/api/items/${id}/move?src=${src}&dest=${dest}`

    // Test
    const res = await request(server).put(url).send()
    expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
  })

  it("should return HTTP status 422 for an invalid object id for 'dest'", async () => {
    // Setup
    const id = new mongoose.Types.ObjectId().toHexString()
    const src = new mongoose.Types.ObjectId().toHexString()
    const dest = 1
    const url = `/api/items/${id}/move?src=${src}&dest=${dest}`

    // Test
    const res = await request(server).put(url).send()
    expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
  })

  it("should return HTTP status 400 for not providing the 'src' query param", async () => {
    // Setup
    const id = new mongoose.Types.ObjectId().toHexString()
    const dest = new mongoose.Types.ObjectId().toHexString()
    const url = `/api/items/${id}/move?dest=${dest}`

    // Test
    const res = await request(server).put(url).send()
    expect(res.status).toBe(httpStatusCodes.badRequest)
  })

  it("should return HTTP status 400 for not providing the 'dest' query param", async () => {
    // Setup
    const id = new mongoose.Types.ObjectId().toHexString()
    const src = new mongoose.Types.ObjectId().toHexString()
    const url = `/api/items/${id}/move?src=${src}`

    // Test
    const res = await request(server).put(url).send()
    expect(res.status).toBe(httpStatusCodes.badRequest)
  })
})
