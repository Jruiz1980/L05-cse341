"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var swagger_autogen_1 = require("swagger-autogen");
var doc = {
    info: {
        title: 'My API Customers',
        description: 'Customers API'
    },
    host: 'project01-whrs.onrender.com',
    schemes: ['https']
};
var outputFile = './swagger.json';
var endpointsFiles = ['./routes/index.ts'];
(0, swagger_autogen_1.default)()(outputFile, endpointsFiles, doc);
