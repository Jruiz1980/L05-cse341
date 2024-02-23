"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getSingle = exports.getAll = void 0;
const express_validator_1 = require("express-validator");
const mongodb_1 = require("mongodb");
const connect_1 = require("../db/connect");
const mongodb = { getDb: connect_1.getDb };
const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDb().collection('customers').find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getAll = getAll;
const getSingle = async (req, res) => {
    if (!mongodb_1.ObjectId.isValid(req.params.id)) {
        res.status(400).json('Must use a valid contact id to find a contact.');
    }
    const integer = req.params.id;
    const userId = new mongodb_1.ObjectId(integer);
    try {
        const result = await mongodb.getDb().collection('customers').find({ _id: userId }).toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result[0]);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.getSingle = getSingle;
const createCustomer = [
    (0, express_validator_1.body)('firstName').notEmpty().withMessage('The first name field is required.'),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage('The last name field is required.'),
    (0, express_validator_1.body)('email').isEmail().withMessage('The email field must be a valid email.'),
    (0, express_validator_1.body)('address').optional().isString(),
    (0, express_validator_1.body)('storeName').notEmpty().withMessage('The store name field is required.'),
    async (req, res) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(412).send({
                success: false,
                message: 'Validation failed',
                data: errors.array()
            });
            return;
        }
        const customer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            address: req.body.address,
            storeName: req.body.storeName
        };
        try {
            const response = await mongodb.getDb().collection('customers').insertOne(customer);
            if (response.acknowledged) {
                res.status(201).json(response);
            }
        }
        catch (err) {
            res.status(500).json(err.message || 'Some error occurred while creating the contact.');
        }
    }
];
exports.createCustomer = createCustomer;
const updateCustomer = [
    (0, express_validator_1.body)('firstName').notEmpty().withMessage('The first name field is required.'),
    (0, express_validator_1.body)('lastName').notEmpty().withMessage('The last name field is required.'),
    (0, express_validator_1.body)('email').isEmail().withMessage('The email field must be a valid email.'),
    (0, express_validator_1.body)('address').optional().isString(),
    (0, express_validator_1.body)('storeName').notEmpty().withMessage('The store name field is required.'),
    async (req, res) => {
        const userId = req.params.id;
        if (!mongodb_1.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Must use a valid contact id to update a contact.' });
            return;
        }
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(412).send({
                success: false,
                message: 'Validation failed',
                data: errors.array()
            });
            return;
        }
        const customer = {};
        if (req.body.firstName)
            customer.firstName = req.body.firstName;
        if (req.body.lastName)
            customer.lastName = req.body.lastName;
        if (req.body.email)
            customer.email = req.body.email;
        if (req.body.address)
            customer.address = req.body.address;
        if (req.body.storeName)
            customer.storeName = req.body.storeName;
        try {
            const response = await mongodb.getDb().collection('customers').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $set: customer });
            if (response.modifiedCount > 0) {
                res.status(204).send();
            }
            else {
                res.status(500).json({ message: 'Error: No contact was updated.', details: response });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Some error occurred while updating the contact.',
                error: error.toString()
            });
        }
    }
];
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res) => {
    try {
        if (!mongodb_1.ObjectId.isValid(req.params.id)) {
            res.status(400).json('Must use a valid contact id to delete a contact.');
            return;
        }
        const integer = req.params.id;
        const userId = new mongodb_1.ObjectId(integer);
        const response = await mongodb.getDb().collection('customers').deleteOne({ _id: userId });
        console.log(response);
        if (response.deletedCount > 0) {
            res.status(204).send();
        }
        else {
            res.status(404).json('No contact found to delete.');
        }
    }
    catch (error) {
        res.status(500).json(error.message || 'Some error occurred while deleting the contact.');
    }
};
exports.deleteCustomer = deleteCustomer;
