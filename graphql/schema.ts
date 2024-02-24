import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Customer {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    address: String
    storeName: String!
  }

  type Query {
    getAllCustomers: [Customer!]!
    getCustomerById(id: ID!): Customer
  }

  type Mutation {
    createCustomer(firstName: String!, lastName: String!, email: String!, address: String, storeName: String!): Customer
    updateCustomer(id: ID!, firstName: String!, lastName: String!, email: String!, address: String, storeName: String!): Customer
    deleteCustomer(id: ID!): Boolean
  }
`;

export default typeDefs;