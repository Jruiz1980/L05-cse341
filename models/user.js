const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  // Puedes agregar más campos según lo necesites
  // Por ejemplo, si quieres diferenciar entre vendedores y otros tipos de usuarios:
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user'
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

// Si quieres añadir métodos o lógica adicional a tu esquema, puedes hacerlo aquí.
// Por ejemplo, un método para verificar si el usuario es un vendedor:
userSchema.methods.isSeller = function () {
  return this.role === 'seller';
};

module.exports = mongoose.model('User', userSchema);
