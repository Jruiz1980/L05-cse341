const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
  const result = await mongodb.getDb().db().collection('customers').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res, next) => {
  const integer = parseInt(req.params.id);
  const userId = new ObjectId(integer);
  const result = await mongodb.getDb().db().collection('customers').find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

const createCustomer = async (req, res) => {
  const customer = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    address: req.body.address,
    storeName: req.body.storeName
  };
  const response = await mongodb.getDb().db().collection('customers').insertOne(customer);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the contact.');
  }
};

const updateCustomer = async (req, res) => {
  const integer = parseInt(req.params.id);
  const userId = new ObjectId(integer);
  // be aware of updateOne if you only want to update specific fields
  const customer = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    address: req.body.address,
    storeName: req.body.storeName
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('customers')
    .replaceOne({ _id: userId }, customer);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the contact.');
  }
};

const deleteCustomer = async (req, res) => {
  const integer = parseInt(req.params.id);
  const userId = new ObjectId(integer);
  const response = await mongodb
    .getDb()
    .db()
    .collection('customers')
    .deleteOne({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
