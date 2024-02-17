const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.temples = require('./customers.js')(mongoose);

router.use('/customers', require('./customers'));
router.use('/', require('./swagger'));

module.exports = router, db;