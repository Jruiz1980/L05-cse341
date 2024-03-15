const {body, validationResult} = require('express-validator')
const mongodb = require('../db/connect');
const {ObjectId} = require('mongodb');

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
  const integer = req.params.id;
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

const createCustomer = [
  body('firstName').notEmpty().withMessage('The first name field is required.'),
  body('lastName').notEmpty().withMessage('The last name field is required.'),
  body('email').isEmail().withMessage('The email field must be a valid email.'),
  body('address').optional().isString(),
  body('storeName').notEmpty().withMessage('The store name field is required.'),
  body('city').notEmpty().withMessage('The city field is required.'),
  body('district').notEmpty().withMessage('The district field is required.'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: errors.array()
      });
    }

    const customer = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      address: req.body.address,
      storeName: req.body.storeName,
      city: req.body.city,
      district: req.body.district
    };

    try {
      const response = await mongodb.getDb().db().collection('customers').insertOne(customer);
      if (response.acknowledged) {
        res.status(201).json(response);
      } else {
        res.status(500).json(response.error || 'Some error occurred while creating the contact.');
      }
    } catch (err) {
      res.status(500).json(err.message || 'Some error occurred while creating the contact.');
    }
  }
];

const updateCustomer = [
  body('firstName').notEmpty().withMessage('The first name field is required.'),
  body('lastName').notEmpty().withMessage('The last name field is required.'),
  body('email').isEmail().withMessage('The email field must be a valid email.'),
  body('address').optional().isString(),
  body('storeName').notEmpty().withMessage('The store name field is required.'),
  body('city').notEmpty().withMessage('The city field is required.'),
  body('district').notEmpty().withMessage('The district field is required.'),

  async (req, res) => {
    const userId = req.params.id;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Must use a valid contact id to update a contact.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: errors.array()
      });
    }

    const customer = {};
    if (req.body.firstName) customer.firstName = req.body.firstName;
    if (req.body.lastName) customer.lastName = req.body.lastName;
    if (req.body.email) customer.email = req.body.email;
    if (req.body.address) customer.address = req.body.address;
    if (req.body.storeName) customer.storeName = req.body.storeName;
    if (req.body.city) customer.city = req.body.city;
    if (req.body.district) customer.district = req.body.district;

    try {
      const response = await mongodb
        .getDb()
        .db()
        .collection('customers')
        .updateOne({ _id: new ObjectId(userId) }, { $set: customer });

      if (response.modifiedCount > 0) {
        res.status(204).send();
      } else {
        return res
          .status(500)
          .json({ message: 'Error: No contact was updated.', details: response });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Some error occurred while updating the contact.',
        error: error.toString()
      });
    }
  }
];

const deleteCustomer = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid contact id to delete a contact.');
    }
    const integer = req.params.id;
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
