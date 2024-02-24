import express = require('express');
import bodyParser = require('body-parser');
import { ApolloServer, gql } from 'apollo-server-express';
import * as mongodb from './db/connect';
import routes from './routes';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello from GraphQL!'
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const port: string | number = process.env.PORT || 8080;
const app = express();

app
  .use(bodyParser.json())
  .use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

server.applyMiddleware({ app });

app.use('/', routes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error message: ', err.message);
  console.error('Stack trace: ', err.stack);
  res.status(500).send('Something broke!');
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

mongodb.initDb((err: any) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});