"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customers_1 = require("./customers");
const swagger_1 = require("./swagger");
const schema_1 = require("../graphql/schema");
const resolvers_1 = require("../graphql/resolvers");
const apollo_server_express_1 = require("apollo-server-express");
const router = express_1.default.Router();
// Create the GraphQL server
const server = new apollo_server_express_1.ApolloServer({ typeDefs: schema_1.default, resolvers: resolvers_1.default });
router.use('/customers', customers_1.default);
router.use('/', swagger_1.default);
const app = (0, express_1.default)();
// Apply the GraphQL server as a middleware to the express application
server.applyMiddleware({ app });
exports.default = router;
