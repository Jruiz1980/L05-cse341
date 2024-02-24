"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const connect_1 = require("../db/connect");
const mongodb = (0, connect_1.getDb)();
const resolvers = {
    Query: {
        getAllCustomers: async () => {
            try {
                const result = await mongodb.collection('customers').find().toArray();
                return result;
            }
            catch (err) {
                throw new Error(err.message);
            }
        },
        getCustomerById: async (_, { id }) => {
            if (!mongodb_1.ObjectId.isValid(id)) {
                throw new Error('Must use a valid contact id to find a contact.');
            }
            try {
                const userId = new mongodb_1.ObjectId(id);
                const result = await mongodb.collection('customers').findOne({ _id: userId });
                return result;
            }
            catch (err) {
                throw new Error(err.message);
            }
        },
    },
    Mutation: {
        createCustomer: async (_, { firstName, lastName, email, address, storeName }) => {
            try {
                const customer = {
                    firstName,
                    lastName,
                    email,
                    address,
                    storeName
                };
                const response = await mongodb.collection('customers').insertOne(customer);
                if (response.insertedId) {
                    return customer;
                }
                throw new Error('Error creating customer.');
            }
            catch (err) {
                throw new Error(err.message || 'Some error occurred while creating the contact.');
            }
        },
        updateCustomer: async (_, { id, firstName, lastName, email, address, storeName }) => {
            try {
                if (!mongodb_1.ObjectId.isValid(id)) {
                    throw new Error('Must use a valid contact id to update a contact.');
                }
                const userId = new mongodb_1.ObjectId(id);
                const customerUpdate = {
                    firstName,
                    lastName,
                    email,
                    address,
                    storeName
                };
                const response = await mongodb.collection('customers').updateOne({ _id: userId }, { $set: customerUpdate });
                if (response.modifiedCount > 0) {
                    return customerUpdate;
                }
                else {
                    throw new Error('Error: No contact was updated.');
                }
            }
            catch (err) {
                throw new Error(err.message || 'Some error occurred while updating the contact.');
            }
        },
        deleteCustomer: async (_, { id }) => {
            try {
                if (!mongodb_1.ObjectId.isValid(id)) {
                    throw new Error('Must use a valid contact id to delete a contact.');
                }
                const userId = new mongodb_1.ObjectId(id);
                const response = await mongodb.collection('customers').deleteOne({ _id: userId });
                if (response.deletedCount > 0) {
                    return { message: 'Customer deleted successfully' };
                }
                else {
                    throw new Error('Error: No contact was deleted.');
                }
            }
            catch (err) {
                throw new Error(err.message || 'Some error occurred while deleting the contact.');
            }
        },
    },
};
exports.default = resolvers;
