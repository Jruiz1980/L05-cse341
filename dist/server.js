"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const apollo_server_express_1 = require("apollo-server-express");
const mongodb = require("./db/connect");
const routes_1 = require("./routes");
const typeDefs = (0, apollo_server_express_1.gql) `
  type Query {
    hello: String
  }
`;
const resolvers = {
    Query: {
        hello: () => 'Hello from GraphQL!'
    }
};
const server = new apollo_server_express_1.ApolloServer({ typeDefs, resolvers });
const port = process.env.PORT || 8080;
const app = express();
app
    .use(bodyParser.json())
    .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
server.applyMiddleware({ app });
app.use('/', routes_1.default);
app.use((err, req, res, next) => {
    console.error('Error message: ', err.message);
    console.error('Stack trace: ', err.stack);
    res.status(500).send('Something broke!');
});
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port);
        console.log(`Connected to DB and listening on ${port}`);
    }
});
