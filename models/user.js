const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: [ 'seller', 'admin'],
    default: 'seller'
  },
  // Fecha de creación y actualización
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.isSeller = function () {
  return this.role === 'seller';
};

module.exports = mongoose.model('seller', userSchema);
