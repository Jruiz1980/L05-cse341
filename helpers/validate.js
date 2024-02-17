// En el archivo validate.js
function Validator(body, rules, customMessages) {
  this.body = body;
  this.rules = rules;
  this.customMessages = customMessages;
  this.errors = {};
}

Validator.prototype.passes = function (callback) {
  let isValid = true;
  Object.entries(this.rules).forEach(([field, rule]) => {
    const validations = rule.split('|');
    validations.forEach((validation) => {
      if (validation === 'required' && !this.body[field]) {
        this.errors[field] =
          this.customMessages[`${field}.required`] || `${field} es un campo requerido.`;
        isValid = false;
      }
      // Aquí puedes continuar con más validaciones (email, string, etc.)
    });
  });

  if (isValid) {
    callback(null, true);
  } else {
    callback(this.errors, false);
  }
};

Validator.prototype.fails = function (callback) {
  this.passes((errors, status) => {
    if (!status) {
      callback(errors, false);
    } else {
      callback(null, true);
    }
  });
};

module.exports = Validator;
