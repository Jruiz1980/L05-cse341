const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API Customers',
    description: 'Customers API'
  },
  host: 'project01-whrs.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
