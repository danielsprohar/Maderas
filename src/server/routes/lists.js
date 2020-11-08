const express = require('express')
const router = express.Router()
const winston = require('../config/winston')
const httpStatusCodes = require('../constants/http-status-codes')
const isValidObjectId = require('../middleware/http-param-validation')
const mongoose = require('mongoose')
const { Board } = require('../models/board')
const { Item } = require('../models/item')
const { List, validate } = require('../models/list')
const { PaginatedResponse } = require('../application/paginated-response')

// ===========================================================================
// Add
// ===========================================================================

router.post('/', async (req, res, next) => {
  const { error } = validate(req.body)
  if (error) {
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send(error.details[0].message)
  }

  const board = await Board.findById(req.body.board)
  if (!board) {
    return res.status(httpStatusCodes.notFound).send('Board does not exist')
  }

  try {
    const list = new List(req.body)
    await list.save()

    winston.info(`A new List was created. List(_id:${list._id})`)

    board.lists.push(list._id)
    await board.save()

    res.status(httpStatusCodes.created).json(list)
  } catch (e) {
    next(e)
  }
})

// ===========================================================================
// Paginated response
// ===========================================================================

router.get('/', async (req, res, next) => {
  const pageIndex = req.query.pageIndex || 0
  const pageSize = req.query.pageSize || 50

  if (!mongoose.Types.ObjectId.isValid(req.query.board)) {
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send("Invalid object id for 'board'")
  }

  const query = {
    board: req.query.board
  }

  try {
    const count = await List.countDocuments(query)
    const lists = await List.find(query)
      .populate('items')
      .sort('_id')
      .skip(pageIndex * pageSize)
      .limit(pageSize)

    res.json(new PaginatedResponse(pageIndex, pageSize, count, lists))
  } catch (e) {
    next(e)
  }
})

// ===========================================================================
// Get by ID
// ===========================================================================

router.get('/:id', isValidObjectId, async (req, res, next) => {
  const list = await List.findById(req.params.id).populate('items')
  res.json(list)
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

  const list = await List.findById(req.params.id).populate('items')
  if (!list) {
    return res.status(httpStatusCodes.notFound).send('List does not exist')
  }

  try {
    list.title = req.body.title
    await list.save()

    winston.info(
      `[UpdateList] A list was updated. List(_id:${list._id}, title: ${list.title})`
    )

    res.status(httpStatusCodes.ok).send(list)
  } catch (e) {
    next(e)
  }
})

// ===========================================================================
// Delete a List
// ===========================================================================

router.put('/:id/clear', isValidObjectId, async (req, res, next) => {
  const list = await List.findById(req.params.id)
  if (!list) {
    return res.status(httpStatusCodes.notFound).send('List does not exist.')
  }

  if (list.items.length === 0) {
    res.status(httpStatusCodes.noContent).send()
  }

  try {
    // Delete all the items
    await Item.deleteMany({
      list: list._id
    })

    // And remove all the references to those items
    await List.updateOne(
      {
        _id: list._id
      },
      {
        $set: {
          items: []
        }
      }
    )

    res.status(httpStatusCodes.noContent).send()
  } catch (e) {
    next(e)
  }
})

// ===========================================================================
// Delete a List
// ===========================================================================

router.delete('/:id', isValidObjectId, async (req, res, next) => {
  const list = await List.findById(req.params.id)
  if (!list) {
    return res.status(httpStatusCodes.notFound).send('List does not exist.')
  }

  const board = await Board.findById(list.board)
  if (!board) {
    return res.status(httpStatusCodes.unprocessableEntity).send()
  }

  try {
    // Delete all the items
    await Item.deleteMany({
      list: list._id
    })

    // Delete the list
    await list.remove()

    // Delete the list reference from the Board
    await Board.updateOne(
      {
        _id: board._id
      },
      {
        $pull: {
          lists: {
            $in: [list._id]
          }
        }
      }
    )

    res.status(httpStatusCodes.noContent).send()
  } catch (e) {
    next(e)
  }
})

// ===========================================================================

module.exports = router
