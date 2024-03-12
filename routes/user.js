const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customers');
const validation = require('../middleware/validate');

router.get('/', customersController.getAll);
router.get('/:id', customersController.getSingle);

module.exports = router;
