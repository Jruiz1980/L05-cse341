const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customers');
const validation = require('../middleware/validate');
const validateSeller = require('../middleware/validateSeller');

router.get('/', customersController.getAll);

router.get('/:id', customersController.getSingle);

router.post('/', validation.saveContact, validateSeller, customersController.createCustomer);

router.put('/:id', validation.saveContact, validateSeller, customersController.updateCustomer);

router.delete('/:id', validateSeller, customersController.deleteCustomer);

module.exports = router;
