const mongodb = require('../db/connect');

const validateSeller = async (req, res, next) => {
  // Asumiendo que el email del usuario está disponible en req.user.email
  const userEmail = req.seller.email; // Uso de optional chaining por si req.user es undefined

  if (!userEmail) {
    return res.status(401).json({ message: 'No se ha podido verificar la identidad del usuario.' });
  }

  try {
    const seller = await mongodb.getDb().db().collection('sellers').findOne({ email: userEmail });
    if (!seller) { // Verifica si existe un registro de vendedor con ese email
      return res.status(403).json({ message: 'Acceso denegado. El usuario no está autorizado como vendedor.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = validateSeller;