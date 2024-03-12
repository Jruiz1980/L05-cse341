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
      authorizationUrl: 'https://project01-whrs.onrender.com/auth/google',
      flow: 'implicit',
      scopes: {
        'read:customers': 'read your customers',
        'write:customers': 'modify customers in your account'
      }
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
