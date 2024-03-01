"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validations = void 0;
const express_validator_1 = require("express-validator");
const validateFirstName = (0, express_validator_1.body)('firstName')
    .notEmpty()
    .withMessage('The first name field is required.');
const validateLastName = (0, express_validator_1.body)('lastName')
    .notEmpty()
    .withMessage('The last name field is required.');
const validateEmail = (0, express_validator_1.body)('email').isEmail().withMessage('The email field must be a valid email.');
const validateAddress = (0, express_validator_1.body)('address').optional().isString();
const validateStoreName = (0, express_validator_1.body)('storeName')
    .notEmpty()
    .withMessage('The store name field is required.');
const validations = [
    validateFirstName,
    validateLastName,
    validateEmail,
    validateAddress,
    validateStoreName
];
exports.validations = validations;
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(412).send({
            success: false,
            message: 'Validation failed',
            data: errors.array()
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
