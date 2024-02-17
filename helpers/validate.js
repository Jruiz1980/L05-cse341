class validator {
  constructor(body, rules, customMessages, callback) /*=>*/ {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
}};

module.exports = validator;
