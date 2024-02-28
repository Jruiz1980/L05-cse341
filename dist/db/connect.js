'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getDb = exports.initDb = void 0;
const dotenv = require('dotenv');
const mongodb_1 = require('mongodb');
dotenv.config();
let _db;
const initDb = (callback) => {
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }
  mongodb_1.MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      _db = client.db(); // Assign the database from the client
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};
exports.initDb = initDb;
const getDb = () => {
  if (!_db) {
    throw new Error('Db not initialized');
  }
  return _db;
};
exports.getDb = getDb;
