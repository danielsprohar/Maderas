const express = require('express')
const { PaginatedResponse } = require('../application/paginated-response')
const router = express.Router()
const winston = require('../config/winston')
const httpStatusCodes = require('../constants/http-status-codes')
const { Board, validate } = require('../models/board')
const { List } = require('../models/list')
const { Template } = require('../models/template')

// ===========================================================================
// Get all
// ===========================================================================
router.get('', async (req, res, next) => {
  const pageIndex = req.query.pageIndex || 0
  const pageSize = req.query.pageSize || 50

  try {
    const count = await Template.countDocuments()

    const templates = await Template.find()
      .select('-lists')
      .sort('_id')
      .skip(pageIndex * pageSize)
      .limit(pageSize)

    res.json(new PaginatedResponse(pageIndex, pageSize, count, templates))
  } catch (e) {
    next(e)
  }
})

// ===========================================================================
// Kanban
// ===========================================================================

router.post('/kanban', async (req, res, next) => {
  const { error } = validate(req.body)
  if (error) {
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send(error.details[0].message)
  }

  try {
    const board = new Board(req.body)
    await board.save()

    winston.info(
      `[Template::Kanban] Board(_id:${board._id}, user: ${board.user})`
    )

    const lists = await List.insertMany([
      new List({ title: 'Backlog', board: board._id }),
      new List({ title: 'Design', board: board._id }),
      new List({ title: 'To do', board: board._id }),
      new List({ title: 'In progress', board: board._id }),
      new List({ title: 'Code Review', board: board._id }),
      new List({ title: 'Testing', board: board._id }),
      new List({ title: 'Done', board: board._id })
    ])

    res.status(httpStatusCodes.created).json({ board, lists })
  } catch (e) {
    winston.error(e)
    next(e)
  }
})

// ===========================================================================

module.exports = router
