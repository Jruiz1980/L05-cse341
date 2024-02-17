// En el archivo validate.js
function Validator(body, rules, customMessages) {
  this.body = body;
  this.rules = rules;
  this.customMessages = customMessages;
  this.errors = {};
}

Validator.prototype.passes = function (callback) {
  // Lógica de validación exitosa
  let isValid = true;
  this.rules.forEach((rule) => {
    const [field, validation] = rule.split('|');
    if (validation === 'required' && !this.body[field]) {
      this.errors[field] = `${field} es un campo requerido.`;
      isValid = false;
    }
  });

  if (isValid) {
    callback(null, true);
  } else {
    callback(this.errors, false);
  }
};

Validator.prototype.fails = function (callback) {
  // Lógica de validación fallida
  this.passes((errors, status) => {
    if (!status) {
      callback(errors, false);
    } else {
      callback(null, true);
    }
  });
};

module.exports = Validator;
