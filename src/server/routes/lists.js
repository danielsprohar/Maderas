const express = require('express')
const router = express.Router()
const winston = require('../config/winston')
const httpStatusCodes = require('../constants/http-status-codes')
const { Board } = require('../models/board')
const { List, validate } = require('../models/list')
const { PaginatedResponse } = require('../application/paginated-response')
const isValidObjectId = require('../middleware/http-param-validation')

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

  // TODO: Validate ObjectId
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

  const list = await List.findById(req.params.id)
  if (!list) {
    return res.status(httpStatusCodes.notFound).send('List does not exist')
  }

  try {
    list.title = req.body.title
    await list.save()

    winston.info(`[UpdateList] A list was updated. List(_id:${list._id})`)

    res.status(httpStatusCodes.ok).send(list)
  } catch (e) {
    next(e)
  }
})

// ===========================================================================

module.exports = router
