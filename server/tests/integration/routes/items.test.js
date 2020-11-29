const request = require('supertest')
const { List } = require('../../../models/list')
const { Item } = require('../../../models/item')
const mongoose = require('mongoose')
const httpStatusCodes = require('../../../constants/http-status-codes')
let server = null

// ===========================================================================

async function clearDb() {
  await List.deleteMany({})
  await Item.deleteMany({})
}

// ===========================================================================

async function createNotFoundRequest() {
  const id = new mongoose.Types.ObjectId().toHexString()
  const res = await request(server).get(`/api/items/${id}`)
  expect(res.status).toBe(httpStatusCodes.notFound)
}

// ===========================================================================
// Top-level test suite
// ===========================================================================

describe('/api/items', () => {
  beforeEach(() => {
    server = require('../../../server')
  })

  afterEach(async () => {
    await clearDb()
    if (server) {
      await server.close()
    }
  })

  // =========================================================================

  describe('GET /', () => {
    it('should return a paginated list of entities with metadata', async () => {
      // Setup
      const listId = new mongoose.Types.ObjectId().toHexString()
      await Item.insertMany([
        {
          title: 'Item 1',
          list: listId
        },
        {
          title: 'Item 2',
          list: listId
        },
        {
          title: 'Item 3',
          list: listId
        }
      ])

      // Test
      const res = await request(server).get('/api/items')
      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body.data.length).toBeGreaterThan(1)
    })
  })

  // =========================================================================

  describe('GET /:id', () => {
    it('should return HTTP status 404', createNotFoundRequest)

    it('should return HTTP status 200 for an Item that exists', async () => {
      // Setup
      const boardId = new mongoose.Types.ObjectId().toHexString()
      const item = new Item({ title: 'test Item', board: boardId })
      await item.save()

      // Test
      const res = await request(server).get(`/api/items/${item._id}`)
      expect(res.status).toBe(httpStatusCodes.ok)
    })
  })

  // =========================================================================

  describe('POST /', () => {
    it('should return HTTP status 422 for an invalid request body', async () => {
      const res = await request(server).post('/api/items').send({})
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it('should return HTTP status 201 upon successful creation of a new Item', async () => {
      // Setup
      const list = new List({
        title: 'Test List',
        board: new mongoose.Types.ObjectId().toHexString()
      })
      await list.save()

      const payload = {
        title: 'test Item',
        list: list._id.toHexString()
      }

      // Test
      const res = await request(server).post('/api/items').send(payload)
      expect(res.status).toBe(httpStatusCodes.created)
      expect(res.body).toBeTruthy()
      expect(res.body).toMatchObject(payload)
    })
  })

  // =========================================================================

  describe('PUT /:id', () => {
    it('should return HTTP status 404', createNotFoundRequest)

    it('should return HTTP status 422 for an invalid request body', async () => {
      // Setup
      const item = new Item({
        title: 'Test Item',
        list: new mongoose.Types.ObjectId().toHexString()
      })
      await item.save()

      // Test
      const url = `/api/items/${item._id}`
      const res = await request(server).put(url).send({})
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    it('should update a Item and return said Item', async () => {
      // Setup
      const item = new Item({
        title: 'Test Item',
        list: new mongoose.Types.ObjectId().toHexString()
      })
      await item.save()

      const url = `/api/items/${item._id}`
      const payload = {
        title: 'Test Item (edit)',
        list: item._id.toHexString()
      }

      // Test
      const res = await request(server).put(url).send(payload)
      expect(res.status).toBe(httpStatusCodes.ok)
      expect(res.body).toBeTruthy()
      expect(res.body).toMatchObject(payload)
    })
  })

  // =========================================================================

  describe('DELETE /:id', () => {
    it('should return HTTP status 404', createNotFoundRequest)

    it('should delete a Item and the reference id from the associated List', async () => {
      // Setup
      let list = new List({
        title: 'Test List',
        board: new mongoose.Types.ObjectId().toHexString()
      })
      await list.save()

      const items = await Item.insertMany([
        {
          title: 'Test Item 1',
          list: list._id.toHexString()
        },
        {
          title: 'Test Item 2',
          list: list._id.toHexString()
        }
      ])

      list.items.push(items[0]._id)
      list.items.push(items[1]._id)
      await list.save()

      // Test
      const url = `/api/items/${items[0].id}`
      const res = await request(server).delete(url)
      expect(res.status).toBe(httpStatusCodes.noContent)

      list = await List.findById(list._id)
      expect(list.items.length).toBe(1)
    })
  })

  // =========================================================================
  describe('PUT /:id/relocate', () => {
    it('should return 422 if the destination index is not provided', async () => {
      const payload = {
        src: new mongoose.Types.ObjectId().toHexString(),
        dest: new mongoose.Types.ObjectId().toHexString()
      }

      const id = new mongoose.Types.ObjectId()
      const url = `/api/items/${id}/relocate`
      const res = await request(server).put(url).send(payload)
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    // =======================================================================

    it('should return 422 if the source list index is not provided', async () => {
      const payload = {
        index: 1,
        dest: new mongoose.Types.ObjectId().toHexString()
      }

      const id = new mongoose.Types.ObjectId()
      const url = `/api/items/${id}/relocate`
      const res = await request(server).put(url).send(payload)
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    // =======================================================================

    it('should return 422 if the destination list index is not provided', async () => {
      const payload = {
        index: 1,
        src: new mongoose.Types.ObjectId().toHexString()
      }

      const id = new mongoose.Types.ObjectId()
      const url = `/api/items/${id}/relocate`
      const res = await request(server).put(url).send(payload)
      expect(res.status).toBe(httpStatusCodes.unprocessableEntity)
    })

    // =======================================================================

    it('should relocate an item from one list and append it to another list', async () => {
      // Setup
      const boardId = new mongoose.Types.ObjectId().toHexString()
      const lists = await List.insertMany([
        { title: 'src', board: boardId },
        { title: 'dest', board: boardId }
      ])

      const itemsInEachList = 3
      let src = lists.find((list) => list.title === 'src')
      let dest = lists.find((list) => list.title === 'dest')

      const srcItems = await Item.insertMany([
        { title: 'Src 1', list: src._id.toHexString() },
        { title: 'Src 2', list: src._id.toHexString() },
        { title: 'Src 3', list: src._id.toHexString() }
      ])

      const destItems = await Item.insertMany([
        { title: 'Dest 1', list: dest._id.toHexString() },
        { title: 'Dest 2', list: dest._id.toHexString() },
        { title: 'Dest 3', list: dest._id.toHexString() }
      ])

      await List.updateOne(
        {
          _id: src._id
        },
        {
          $push: {
            items: {
              $each: srcItems.map((item) => item._id.toHexString())
            }
          }
        }
      )

      await List.updateOne(
        {
          _id: dest._id
        },
        {
          $push: {
            items: {
              $each: destItems.map((item) => item._id.toHexString())
            }
          }
        }
      )

      // Test
      let item = srcItems[0]
      const payload = { index: 1, src: src._id, dest: dest._id }
      const url = `/api/items/${item._id}/relocate`
      const res = await request(server).put(url).send(payload)
      expect(res.status).toBe(httpStatusCodes.noContent)

      src = await List.findById(src._id)
      dest = await List.findById(dest._id)
      expect(src.items.length).toBe(itemsInEachList - 1)
      expect(dest.items.length).toBe(itemsInEachList + 1)

      item = await Item.findById(item._id)
      expect(item.list).toEqual(dest._id)
    })
  })
})
