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
      authorizationUrl: 'https://project01-whrs.onrender.com/oauth/authorize',
      flow: 'implicit',
      scopes: {}
    }
  }
}

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('Documentation successfully generated!');
});
