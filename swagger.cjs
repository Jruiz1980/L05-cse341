var swaggerAutogen = require('swagger-autogen');
var doc = {
    info: {
        title: 'My API Customers',
        description: 'Customers API',
    },
    host: 'project01-whrs.onrender.com',
    schemes: ['https'],
};
var outputFile = './swagger.json';
var endpointsFiles = ['./routes/index.ts'];
swaggerAutogen()(outputFile, endpointsFiles, doc)
    .then(function () {
    console.log("Documentation successfully generated!");
});
