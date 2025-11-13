const express = require('express');
const entityController = require('../controllers/__TEMPLATE.controller'); // Replace with your controller
const asyncHandler = require('../middlewares/asyncHandler');

// TEMPLATE: Replace 'entity' with your actual entity name
const router = express.Router();

router
    .route('/')
    .get(asyncHandler(entityController.getAll.bind(entityController)))
    .post(asyncHandler(entityController.create.bind(entityController)))
    .delete(asyncHandler(entityController.deleteAll.bind(entityController)));

router
    .route('/:id')
    .get(asyncHandler(entityController.getById.bind(entityController)))
    .put(asyncHandler(entityController.update.bind(entityController)))
    .delete(asyncHandler(entityController.delete.bind(entityController)));

module.exports = router;
