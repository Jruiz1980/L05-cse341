"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var dotenv = require("dotenv");
var mongodb = require("./db/connect");
var port = process.env.PORT || 8080;
var app = express();
dotenv.config();
app
    .use(bodyParser.json())
    .use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})
    .use('/', require('./routes'));
app.use(function (err, req, res, next) {
    console.error('Error message: ', err.message);
    console.error('Stack trace: ', err.stack);
    res.status(500).send('Something broke!');
});
process.on('unhandledRejection', function (reason, promise) {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
mongodb.initDb(function (err) {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port);
        console.log("Connected to DB and listening on ".concat(port));
    }
});
