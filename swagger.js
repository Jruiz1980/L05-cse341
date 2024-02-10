const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API Contacts',
    description: 'Contacts API'
  },
  host: 'cse341-jiruiz.onrender.com',
  schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
