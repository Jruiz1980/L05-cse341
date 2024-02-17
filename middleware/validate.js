const Validator = require('../helpers/validate');

const saveContact = (req, res, next) => {
  const validationRule = {
    firstName: 'required|string',
    lastName: 'required|string',
    email: 'required|email',
    address: 'string',
    storeName: 'required|string'
  };
  const validationMessages = {
    'firstName.required': 'The first name field is required.',
    'lastName.required': 'The last name field is required.',
    'email.required': 'The email field is required.',
    'email.email': 'The email field must be a valid email.'
    
  };

  let validator = new Validator(req.body, validationRule, validationMessages);
  
  validator(req.body, validationRule, validationMessages, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveContact
};
