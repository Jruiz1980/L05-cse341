import { ObjectId } from 'mongodb';
import { getDb } from '../db/connect';

const mongodb = getDb();

const resolvers = {
  Query: {
    getAllCustomers: async () => {
      try {
        const result = await mongodb.collection('customers').find().toArray();
        return result;
      } catch (err) {
        throw new Error(err.message);
      }
    },
    getCustomerById: async (_: any, { id }: { id: string }) => {
  if (!ObjectId.isValid(id)) {
    throw new Error('Must use a valid contact id to find a contact.');
  }
  try {
    const userId = new ObjectId(id);
    const result = await mongodb.collection('customers').findOne({ _id: userId });
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
},
  },
  Mutation: {
  createCustomer: async (_: any, { firstName, lastName, email, address, storeName }: { firstName: string, lastName: string, email: string, address: string, storeName: string }) => {
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
    } catch (err) {
      throw new Error(err.message || 'Some error occurred while creating the contact.');
    }
  },
  updateCustomer: async (_: any, { id, firstName, lastName, email, address, storeName }: { id: string, firstName: string, lastName: string, email: string, address: string, storeName: string }) => {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error('Must use a valid contact id to update a contact.');
      }
      const userId = new ObjectId(id);
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
      } else {
        throw new Error('Error: No contact was updated.');
      }
    } catch (err) {
      throw new Error(err.message || 'Some error occurred while updating the contact.');
    }
  },
  deleteCustomer: async (_: any, { id }: { id: string }) => {
    try {
      if (!ObjectId.isValid(id)) {
        throw new Error('Must use a valid contact id to delete a contact.');
      }
      const userId = new ObjectId(id);
      const response = await mongodb.collection('customers').deleteOne({ _id: userId });
      if (response.deletedCount > 0) {
        return { message: 'Customer deleted successfully' };
      } else {
        throw new Error('Error: No contact was deleted.');
      }
    } catch (err) {
      throw new Error(err.message || 'Some error occurred while deleting the contact.');
    }
  },
},
};

export default resolvers;