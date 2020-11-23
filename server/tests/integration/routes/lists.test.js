const request = require('supertest')
const { Board } = require('../../../models/board')
const { List } = require('../../../models/list')
const { Item } = require('../../../models/item')
const mongoose = require('mongoose')
const httpStatusCodes = require('../../../constants/http-status-codes')
const boardId = new mongoose.Types.ObjectId().toHexString()
let server = null

// ===========================================================================

async function clearDb() {
  await Board.deleteMany({})
  await List.deleteMany({})
  await Item.deleteMany({})
}

// ===========================================================================

async function createNotFoundRequest() {
  const id = new mongoose.Types.ObjectId().toHexString()
  const res = await request(server).get(`/api/lists/${id}`)
  expect(res.status).toBe(httpStatusCodes.notFound)
}

// ===========================================================================
// Top-level test suite
// ===========================================================================

describe('/api/lists', () => {
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

  describe('GET /', () => {
    it('should return a paginated list', async () => {
      // Setup
      const lists = await List.insertMany([
        {
          title: 'List 1',
          board: boardId
        },
        {
          title: 'List 2',
          board: boardId
        },
        {
          title: 'List 3',
          board: boardId
        }
      ])

      // Test
      const res = await request(server).get('/api/lists')
      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body.data.length).toBeGreaterThan(1)
    })
  })

  // =========================================================================

  describe('GET /:id', () => {
    it('should return HTTP status 404', createNotFoundRequest)

    it('should return HTTP status 200 for a List that exists', async () => {
      const list = new List({ title: 'test', board: boardId })
      await list.save()

      const res = await request(server).get(`/api/lists/${list._id}`)
      expect(res.status).toBe(httpStatusCodes.ok)
    })
  })

  // =========================================================================

  describe('POST /', () => {
    it('should return HTTP status 422 for an invalid request body', async () => {
      const res = await request(server).post('/api/lists').send({})
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it('should return HTTP status 201 upon successful creation of a new List', async () => {
      const userId = new mongoose.Types.ObjectId().toHexString()
      const board = new Board({ title: 'test board', user: userId })
      await board.save()

      const payload = {
        title: 'test',
        board: board._id.toHexString()
      }

      const res = await request(server).post('/api/lists').send(payload)
      expect(res.status).toBe(httpStatusCodes.created)
      expect(res.body).toBeTruthy()
      expect(res.body).toMatchObject(payload)
    })
  })

  // =========================================================================

  describe('PUT /:id', () => {
    it('should return HTTP status 404', createNotFoundRequest)

    it('should return HTTP status 422 for an invalid request body', async () => {
      const list = List.create({ title: 'test', board: boardId })

      const url = `/api/lists/${list._id}`
      const res = await request(server).put(url).send({})
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it('should return 200 and the updated List', async () => {
      const list = await List.create({ title: 'test', board: boardId })
      const url = `/api/lists/${list._id}`
      const payload = {
        title: 'test (edit)',
        board: boardId
      }

      const res = await request(server).put(url).send(payload)
      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body).toBeTruthy()
      expect(res.body).toMatchObject(payload)
    })
  })

  // =========================================================================

  describe('DELETE /:id', () => {
    it('should return HTTP status 404', createNotFoundRequest)

    it('should delete a List and all of its related documents', async () => {
      const userId = new mongoose.Types.ObjectId().toHexString()
      const board = new Board({ title: 'test board', user: userId })
      await board.save()

      const list = new List({
        title: 'test list',
        board: board._id.toHexString()
      })
      await list.save()

      const url = `/api/lists/${list._id}`
      const res = await request(server).delete(url)
      expect(res.status).toBe(httpStatusCodes.noContent)
    })
  })

  // =========================================================================

  describe('DELETE /:id/clear-items', () => {
    it('should return HTTP status 404', createNotFoundRequest)

    it('should return 204 when a list does not contain any items', async () => {
      // Setup
      const list = await List.create({
        title: 'Test list',
        board: new mongoose.Types.ObjectId()
      })

      // Test
      const url = `/api/lists/${list._id}/clear-items`
      const res = await request(server).put(url)
      expect(res.status).toBe(httpStatusCodes.noContent)
    })

    it('should delete all Items within a List', async () => {
      const userId = new mongoose.Types.ObjectId().toHexString()

      // Create the parent entity
      const board = await Board.create({ title: 'test board', user: userId })

      // Create the entity
      const list = await List.create({
        title: 'test list',
        board: board._id.toHexString()
      })

      // Create the dependent entities
      const items = await Item.insertMany([
        { title: 'test Item 1', list: list._id.toHexString() },
        { title: 'test Item 2', list: list._id.toHexString() },
        { title: 'test Item 3', list: list._id.toHexString() }
      ])

      // Create the associate between parent and child
      for (const item of items) {
        list.items.push(item._id)
      }

      await list.save()

      // Test
      const url = `/api/lists/${list._id}/clear-items`
      const res = await request(server).put(url)
      expect(res.status).toBe(httpStatusCodes.noContent)
    })
  })

  // =========================================================================

  describe('PUT /:id/move-item', () => {
    let listId = null
    let itemId = null

    beforeEach(async () => {
      const list = await List.create({
        title: 'Test',
        board: new mongoose.Types.ObjectId().toHexString()
      })

      listId = list._id

      const items = await Item.insertMany([
        { title: 'Item 1', list: list._id },
        { title: 'Item 2', list: list._id },
        { title: 'Item 3', list: list._id },
        { title: 'Item 4', list: list._id },
        { title: 'Item 5', list: list._id }
      ])

      itemId = items[0]._id
    })

    afterEach(async () => {
      await List.remove()
      await Item.remove()
    })

    // =======================================================================

    it('should return 422 for an invalid request body', async () => {
      const url = `/api/lists/${listId}/move-item`
      const res = await request(server).put(url).send({})
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    // =======================================================================

    it('should return 404 for List not found', async () => {
      const id = new mongoose.Types.ObjectId().toHexString()
      const payload = {
        itemId,
        destinationIndex: 2
      }

      const url = `/api/lists/${id}/move-item`
      const res = await request(server).put(url).send(payload)
      expect(res.status).toBe(httpStatusCodes.notFound)
    })

    // =======================================================================

    it('should return 404 for Item not found', async () => {
      const payload = {
        itemId: new mongoose.Types.ObjectId().toHexString(),
        destinationIndex: 2
      }

      const url = `/api/lists/${listId}/move-item`
      const res = await request(server).put(url).send(payload)
      expect(res.status).toBe(httpStatusCodes.notFound)
    })

    // =======================================================================

    it('should return 204 to indicate the item was moved', async () => {
      // The "itemId" points to the first element in the array
      const payload = {
        itemId,
        destinationIndex: 1
      }

      const url = `/api/lists/${listId}/move-item`
      const res = await request(server).put(url).send(payload)
      expect(res.status).toBe(httpStatusCodes.noContent)
    })
  })
})
