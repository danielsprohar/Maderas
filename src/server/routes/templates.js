const express = require('express')
const isValidObjectId = require('../middleware/object-id')
const { PaginatedResponse } = require('../application/paginated-response')
const router = express.Router()
const httpStatusCodes = require('../constants/http-status-codes')
const winston = require('../logger/winston')
const { Template, validate } = require('../models/template')

// ===========================================================================
// Check if the template name exists.
// ===========================================================================

router.get('/is-available', async (req, res, next) => {
  if (!req.query.name) {
    return res.statusCode(httpStatusCodes.badRequest).send()
  }

  try {
    const count = await Template.countDocuments({
      name: new String(req.query.name).trim().toLowerCase()
    })

    res.json(count === 0 ? true : false)
  } catch (e) {
    next(e)
  }
})

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
// Add a Template
// ===========================================================================
router.post('/', async (req, res, next) => {
  const { error } = validate(req.body)
  if (error) {
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send(error.details[0].message)
  }

  // Check if the template name is available
  const count = await Template.countDocuments({
    name: new String(req.body.name).trim().toLowerCase()
  })

  if (count !== 0) {
    return res
      .status(httpStatusCodes.unprocessableEntity)
      .send('Template name is not available.')
  }

  try {
    const template = await Template.create(req.body)
    return res.status(httpStatusCodes.created).send(template)
  } catch (e) {
    next(e)
  }
})

// ===========================================================================

module.exports = router
