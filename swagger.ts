const swaggerAutogen = require('swagger-autogen');

const doc = {
  info: {
    title: 'My API Customers',
    description: 'Customers API',
  },
  host: 'project01-whrs.onrender.com',
  schemes: ['https'],
  securityDefinitions: {
    OAuth2: {
      type: 'oauth2',
      authorizationUrl: 'https://tu-servidor-de-autenticacion.com/auth',
      tokenUrl: 'https://tu-servidor-de-autenticacion.com/token',
      flow: 'accessCode',
      scopes: {
        'read:customers': 'Read data client',
        'write:customers': 'Modify data client'
      }
    }
  },
  security: [{
    OAuth2: ['read:customers', 'write:customers']
  }]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('Documentation successfully generated!');
});
