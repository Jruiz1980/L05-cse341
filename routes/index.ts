import express from 'express';
import customersRoutes from './customers';
import swaggerRoutes from './swagger';
import typeDefs from "../graphql/schema";
import resolvers from "../graphql/resolvers";
import { ApolloServer, ServerRegistration } from 'apollo-server-express';

const router: express.Router = express.Router();

// Create the GraphQL server
const server = new ApolloServer({ typeDefs, resolvers });

router.use('/customers', customersRoutes);
router.use('/', swaggerRoutes);

const app = express();
// Apply the GraphQL server as a middleware to the express application
server.applyMiddleware({app});

export default router;