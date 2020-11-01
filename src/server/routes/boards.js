const express = require('express')
const router = express.Router()
const winston = require('../config/winston')
const httpStatusCodes = require('../constants/http-status-codes')
const { Board, validate } = require('../models/board')
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
    const board = new Board(req.body)
    await board.save()

    winston.info(`[AddBoard] Board(_id:${board._id}, user: ${board.user})`)

    res.status(httpStatusCodes.created).json(board)
  } catch (e) {
    winston.error(e)
    next(e)
  }
})

// ===========================================================================
// Paginated response
// ===========================================================================

router.get('/', async (req, res, next) => {
  const pageIndex = req.query.pageIndex || 0
  const pageSize = req.query.pageSize || 50

  try {
    const count = await Board.countDocuments()
    const boards = await Board.find()
      .sort('-_id')
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
  const board = await Board.findById(req.params.id).populate('lists')

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

  const board = await Board.findById(req.params.id)
  if (!board) {
    return res.status(httpStatusCodes.notFound).send('Board does not exist')
  }

  try {
    board.title = req.body.title
    await board.save()

    winston.info(`[UpdateBoard] A board was updated. Board(_id:${board._id})`)

    res.status(httpStatusCodes.ok).send(board)
  } catch (e) {
    winston.error(e)
    next(e)
  }
})

// ===========================================================================

module.exports = router
