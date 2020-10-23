const express = require('express')
const router = express.Router()
const winston = require('../config/winston')
const httpStatusCodes = require('../constants/http-status-codes')
const { List, validate } = require('../models/board')
const { PaginatedResponse } = require('../application/paginated-response')
const isValidObjectId = require('../middleware/http-param-validation')


// ===========================================================================
// Add
// ===========================================================================

router.post('/', async (req, res, next) => {
  const { error } = validate(req.body)
  if (error) {
    winston.error(error)
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send(error.details[0].message)
  }

  try {
    const board = new List(req.body)
    await board.save()
    res.status(httpStatusCodes.created).json(board)
  } catch (e) {
    winston.error(e)
    next(e)
  }
})

// ===========================================================================
// Paginated list
// ===========================================================================

router.get('/', async (req, res, next) => {
  const pageIndex = req.query.pageIndex || 0
  const pageSize = req.query.pageSize || 50

  try {
    const count = await List.countDocuments()
    const boards = await List.find()
      .sort('_id')
      .skip(pageIndex * pageSize)
      .limit(pageSize)

    res.json(new PaginatedResponse(pageIndex, pageSize, count, boards))
  } catch (e) {
    winston.error(e)
    next(e)
  }
})

// ===========================================================================
// Get by ID
// ===========================================================================

router.get('/:id', isValidObjectId, async (req, res, next) => {
  const board = await List.findById(req.params.id)
    // TODO: Populate the list
    // .populate('items')
  res.json(board)
})

// ===========================================================================
// Update
// ===========================================================================

router.put('/:id', isValidObjectId, async (req, res, next) => {
  const { error } = validate(req.body)
  if (error) {
    winston.error(error)
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send(error.details[0].message)
  }

  const board = await List.findById(req.params.id)
  if (!board) {
    return res.status(httpStatusCodes.notFound).send('List does not exist')
  }

  try {
    board.title = req.body.title
    await board.save()

    winston.info(`A board was updated. List(_id:${board._id})`)
    res.status(httpStatusCodes.noContent).send()
  } catch (e) {
    winston.error(e)
    next(e)
  }
})

// ===========================================================================

module.exports = router