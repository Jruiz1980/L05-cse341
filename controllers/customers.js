const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection('customers').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSingle = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid contact id to find a contact.');
  }
  const integer = parseInt(req.params.id);
  const userId = new ObjectId(integer);

  try {
    const result = await mongodb
      .getDb()
      .db()
      .collection('customers')
      .find({ _id: userId })
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createCustomer = async (req, res) => {
  const customer = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    address: req.body.address,
    storeName: req.body.storeName
  };

  try {
    await new Promise((resolve, reject) => {
      validator(req.body, validationRule, validationMessages, {}, (err, status) => {
        if (!status) {
          res.status(412).send({
            success: false,
            message: 'Validation failed',
            data: err
          });
          reject();
        } else {
          resolve();
        }
      });
    });

    const response = await mongodb.getDb().db().collection('customers').insertOne(customer);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the contact.');
    }
  } catch (err) {
    res.status(500).json(err.message || 'Some error occurred while creating the contact.');
  }
};

const updateCustomer = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid contact id to update a contact.');
    }
    const integer = parseInt(req.params.id);
    const userId = new ObjectId(integer);

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
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while updating the contact.');
  }
};

const deleteCustomer = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid contact id to delete a contact.');
    }
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
  } catch (error) {
    res.status(500).json(error.message || 'Some error occurred while deleting the contact.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
