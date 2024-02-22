"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.initDb = void 0;
var dotenv_1 = require("dotenv");
var mongodb_1 = require("mongodb");
dotenv_1.default.config();
var _db;
var initDb = function (callback) {
    if (_db) {
        console.log('Db is already initialized!');
        return callback(null, _db);
    }
    mongodb_1.MongoClient.connect(process.env.MONGODB_URI)
        .then(function (client) {
        _db = client.db(); // Assign the database from the client
        callback(null, _db);
    })
        .catch(function (err) {
        callback(err);
    });
};
exports.initDb = initDb;
var getDb = function () {
    if (!_db) {
        throw new Error('Db not initialized');
    }
    return _db;
};
exports.getDb = getDb;
