const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customers');
const validation = require('../middleware/validate');
const validateSeller = require('../middleware/validateSeller');
const isAuthenticated = require('../middleware/auth');

router.get('/', customersController.getAll);

router.get('/:id', customersController.getSingle);

router.post(
  '/',
  //isAuthenticated, 
  validateSeller,
  validation.saveContact,
  customersController.createCustomer
);

router.put(
  '/:id',
  //isAuthenticated, 
  validateSeller,
  validation.saveContact,
  customersController.updateCustomer
);

router.delete('/:id', 
//isAuthenticated, 
validateSeller, 
customersController.deleteCustomer);

module.exports = router;
