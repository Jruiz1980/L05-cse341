const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API Customers',
    description: 'Customers API'
  },
  host: 'project01-whrs.onrender.com',
  schemes: ['https'],
  securityDefinitions: {
    BearerAuth: {
      type: 'oauth2',
      authorizationUrl: 'https://project01-whrs.onrender.com/api-docs',
      flow: 'implicit',
      scopes: {}
    }
  },
  security: [
    {
      BearerAuth: []
    }
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
