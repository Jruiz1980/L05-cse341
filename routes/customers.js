const express = require('express');
const router = express.Router();

const customersController = require('../controllers/customers');

router.get('/', customersController.getAll);

router.get('/:id', customersController.getSingle);

router.post('/', customersController.createCustomer);

router.put('/:id', customersController.updateCustomer);

router.delete('/:id', customersController.deleteCustomer);

module.exports = router;
