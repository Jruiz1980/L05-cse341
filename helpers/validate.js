

let data = {
  firstName: 'string',
  lastName: 'string',
  email: 'email',
  address: 'string',
  storeName: 'string'
};

const rules = {
  firstName: 'required',
  lastName: 'required',
  email: 'required|email',
  address: 'required',
  storeName: 'required'
};


if (validation.passes()) {
  return null
} else {
  let errors = validation.errors.all();
  return errors;
}