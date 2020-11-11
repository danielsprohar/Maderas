const express = require('express')
const isValidObjectId = require('../middleware/object-id')
const { PaginatedResponse } = require('../application/paginated-response')
const router = express.Router()
const httpStatusCodes = require('../constants/http-status-codes')
const { Template } = require('../models/template')

// ===========================================================================
// Get all
// ===========================================================================
router.get('/', async (req, res, next) => {
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
// Get by ID
// ===========================================================================

router.get('/:id', isValidObjectId, async (req, res, next) => {
  const template = await Template.findById(req.params.id)

  if (!template) {
    return res.status(httpStatusCodes.notFound).send('Template does not exist.')
  }

  res.json(template)
})

// ===========================================================================

// TODO: Add an endpoint to create a user-defined template.

// ===========================================================================

module.exports = router
