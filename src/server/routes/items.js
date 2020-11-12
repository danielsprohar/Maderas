const express = require('express')
const router = express.Router()
const winston = require('../logger/winston')
const httpStatusCodes = require('../constants/http-status-codes')
const { List } = require('../models/list')
const { Item, validate } = require('../models/item')
const { PaginatedResponse } = require('../application/paginated-response')
const isValidObjectId = require('../middleware/object-id')
const isValidMoveItemRequest = require('../middleware/move-item-request')
const mongoose = require('mongoose')

// ===========================================================================
// Add an Item
// ===========================================================================

router.post('/', async (req, res, next) => {
  const { error } = validate(req.body)
  if (error) {
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send(error.details[0].message)
  }

  const list = await List.findById(req.body.list)
  if (!list) {
    return res.status(httpStatusCodes.notFound).send('List does not exist')
  }

  try {
    const item = new Item(req.body)
    await item.save()

    winston.info(`A new Item was created. Item(_id:${item._id})`)

    list.items.push(item._id)
    await list.save()

    res.status(httpStatusCodes.created).json(item)
  } catch (e) {
    next(e)
  }
})

// ===========================================================================
// Paginated response
// ===========================================================================

router.get('/', async (req, res, next) => {
  let query = {}

  if (req.query.list) {
    if (!mongoose.Types.ObjectId.isValid(req.query.list)) {
      return res
        .status(httpStatusCodes.badRequest)
        .send('A valid List ID was not specified.')
    }
    query.list = req.query.list
  }

  const pageIndex = req.query.pageIndex || 0
  const pageSize = req.query.pageSize || 50

  try {
    const count = await Item.countDocuments(query)
    const items = await Item.find(query)
      .sort('_id')
      .skip(pageIndex * pageSize)
      .limit(pageSize)

    res.json(new PaginatedResponse(pageIndex, pageSize, count, items))
  } catch (e) {
    next(e)
  }
})

// ===========================================================================
// Get by ID
// ===========================================================================

router.get('/:id', isValidObjectId, async (req, res, next) => {
  const item = await Item.findById(req.params.id)
  if (!item) {
    return res.status(httpStatusCodes.notFound).send('Item does not exist.')
  }
  res.json(item)
})

// ===========================================================================
// Update
// ===========================================================================

router.put('/:id', isValidObjectId, async (req, res, next) => {
  const { error } = validate(req.body)
  if (error) {
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send(error.details[0].message)
  }

  const item = await Item.findById(req.params.id)
  if (!item) {
    return res.status(httpStatusCodes.notFound).send('Item does not exist')
  }

  try {
    Object.assign(item, req.body)
    await item.save()

    winston.info(`[UpdateItem] An item was updated. Item(_id:${item._id})`)

    res.status(httpStatusCodes.ok).send(item)
  } catch (e) {
    next(e)
  }
})

// ===========================================================================
// Delete an item from a list
// ===========================================================================

router.delete('/:id', isValidObjectId, async (req, res, next) => {
  const item = await Item.findById(req.params.id)
  if (!item) {
    return res.status(httpStatusCodes.notFound).send('Item does not exist')
  }

  const list = await List.findById(item.list)
  if (!list) {
    return res.status(httpStatusCodes.unprocessableEntity).send()
  }

  try {
    await List.updateOne(
      {
        _id: item.list
      },
      {
        $pull: {
          items: {
            $in: [item.id]
          }
        }
      }
    )

    await item.remove()
    res.status(httpStatusCodes.noContent).send()
  } catch (e) {
    next(e)
  }
})

// ===========================================================================
// Move item to another list
// ===========================================================================
router.put(
  '/:id/move',
  [isValidObjectId, isValidMoveItemRequest],
  async (req, res, next) => {
    const item = await Item.findById(req.params.id)
    if (!item) {
      return res.status(httpStatusCodes.notFound).send('Item does not exist')
    }

    try {
      item.list = req.query.dest
      await item.save()

      await List.updateOne(
        {
          _id: req.query.src
        },
        {
          $pull: {
            items: {
              $in: [item._id]
            }
          }
        }
      )

      await List.updateOne(
        {
          _id: req.query.dest
        },
        {
          $push: {
            items: {
              $each: [item._id]
            }
          }
        }
      )

      res.status(httpStatusCodes.noContent).send()
    } catch (e) {
      next(e)
    }
  }
)

// ===========================================================================

module.exports = router
