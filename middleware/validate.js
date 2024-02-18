const { body, validationResult } = require('express-validator');

const saveContact = [
  body('firstName').notEmpty().withMessage('The first name field is required.'),
  body('lastName').notEmpty().withMessage('The last name field is required.'),
  body('email').isEmail().withMessage('The email field must be a valid email.'),
  body('address').optional().isString(),
  body('storeName').notEmpty().withMessage('The store name field is required.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: errors.array()
      });
    } else {
      next();
    }
  }
];

module.exports = {
  saveContact
};
