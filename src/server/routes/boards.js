const express = require('express')
const router = express.Router()
const winston = require('../logger/winston')
const httpStatusCodes = require('../constants/http-status-codes')
const { Board, validate } = require('../models/board')
const { List } = require('../models/list')
const { Item } = require('../models/item')
const { Template } = require('../models/template')
const { PaginatedResponse } = require('../application/paginated-response')
const isValidObjectId = require('../middleware/object-id')
const mongoose = require('mongoose')

// ===========================================================================
// Create
// ===========================================================================

router.post('/', async (req, res, next) => {
  const { error } = validate(req.body)
  if (error) {
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
    next(e)
  }
})

// ===========================================================================
// Paginated response
// ===========================================================================

router.get('/', async (req, res, next) => {
  if (req.query.user && !mongoose.Types.ObjectId.isValid(req.query.user)) {
    return res
      .status(httpStatusCodes.badRequest)
      .send('A valid User ID was not specified.')
  }

  const pageIndex = req.query.pageIndex || 0
  const pageSize = req.query.pageSize || 50
  let query = {}
  if (req.query.user) {
    if (!mongoose.Types.ObjectId.isValid(req.query.user)) {
      return res
        .status(httpStatusCodes.unprocessableEntity)
        .send('Invalid format: user.')
    }
    query.user = req.query.user
  }

  try {
    const count = await Board.countDocuments(query)
    const boards = await Board.find(query)
      .sort('-_id')
      .skip(pageIndex * pageSize)
      .limit(pageSize)

    res.json(new PaginatedResponse(pageIndex, pageSize, count, boards))
  } catch (e) {
    next(e)
  }
})

// ===========================================================================
// Get by ID
// ===========================================================================

router.get('/:id', isValidObjectId, async (req, res, next) => {
  const board = await Board.findById(req.params.id).populate('lists')
  if (!board) {
    return res.status(httpStatusCodes.notFound).send('Board does not exist.')
  }
  res.json(board)
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
    next(e)
  }
})

// ===========================================================================
// Delete a Board
// ===========================================================================

router.delete('/:id', isValidObjectId, async (req, res, next) => {
  const board = await Board.findById(req.params.id)
  if (!board) {
    return res.status(httpStatusCodes.notFound).send('Board does not exist.')
  }

  try {
    // Remove every item from every list
    for (const list of board.lists) {
      await Item.deleteMany({
        list: list._id
      })
    }

    // Remove every list
    await List.deleteMany({
      board: board._id
    })

    // Delete the board
    await board.remove()

    res.status(httpStatusCodes.noContent).send()
  } catch (e) {
    next(e)
  }
})

// ===========================================================================
// Create from a template
// ===========================================================================

router.post(
  '/create-from/template/:id',
  isValidObjectId,
  async (req, res, next) => {
    const { error } = validate(req.body)
    if (error) {
      return res
        .status(httpStatusCodes.unprocessableEntity)
        .send(error.details[0].message)
    }

    const template = await Template.findById(req.params.id)

    if (!template) {
      return res
        .status(httpStatusCodes.notFound)
        .send('Template does not exist.')
    }

    try {
      const board = new Board(req.body)
      await board.save()

      const boardLists = []

      template.lists.forEach((list) => {
        boardLists.push(
          new List({
            title: list.title,
            board: board._id
          })
        )
      })

      const lists = await List.insertMany(boardLists)

      lists.forEach((list) => {
        board.lists.push(list._id)
      })

      await board.save()

      winston.info(
        `[Board::CreateFromTemplate] Board(_id: ${board._id}, user: ${board.user}), Template(_id: ${template._id})`
      )

      res.status(httpStatusCodes.created).json(board)
    } catch (e) {
      next(e)
    }
  }
)

// ===========================================================================

module.exports = router
