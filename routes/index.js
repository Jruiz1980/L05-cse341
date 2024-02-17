const express = require('express');
const router = express.Router();

router.use('/customers', require('./customers'));
router.use('/', require('./swagger'));

module.exports = router;