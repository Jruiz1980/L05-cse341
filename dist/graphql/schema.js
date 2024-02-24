"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs = (0, apollo_server_express_1.gql) `
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
exports.default = typeDefs;
