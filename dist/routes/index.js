'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const express = require('express');
const customers_1 = require('./customers');
const swagger_1 = require('./swagger');
const router = express.Router();
router.use('/customers', customers_1.default);
router.use('/', swagger_1.default);
exports.default = router;
