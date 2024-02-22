import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ValidationChain } from 'express-validator';

const validateFirstName = body('firstName').notEmpty().withMessage('The first name field is required.');
const validateLastName = body('lastName').notEmpty().withMessage('The last name field is required.');
const validateEmail = body('email').isEmail().withMessage('The email field must be a valid email.');
const validateAddress = body('address').optional().isString();
const validateStoreName = body('storeName').notEmpty().withMessage('The store name field is required.');

const validations: ValidationChain[] = [validateFirstName, validateLastName, validateEmail, validateAddress, validateStoreName];

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(412).send({
            success: false,
            message: 'Validation failed',
            data: errors.array()
        });
    }
    next();
};

export { validations, handleValidationErrors };