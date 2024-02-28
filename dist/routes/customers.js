'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express = require('express');
const customers_1 = require('../controllers/customers');
const validate_1 = require('../middleware/validate');
const router = express.Router();
router.get('/', customers_1.getAll);
router.get('/:id', customers_1.getSingle);
router.post(
  '/',
  validate_1.validations,
  validate_1.handleValidationErrors,
  customers_1.createCustomer
);
router.put(
  '/:id',
  validate_1.validations,
  validate_1.handleValidationErrors,
  customers_1.updateCustomer
);
router.delete('/:id', customers_1.deleteCustomer);
exports.default = router;
