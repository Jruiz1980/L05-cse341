const mongodb = require('../db/connect');

const validateSeller = async (req, res, next) => {

  if (!req.user || !req.user.email) {
    return res.status(401).json({ message: 'Required Authenticate.' });
  }

  try {
    const userEmail = req.user.email;
    const seller = await mongodb.getDb().db().collection('sellers').findOne({ email: userEmail });
    if(!seller) {
      return res.status(403).json({message: 'Denied Access. Seller not authorized' })
    }
    next();
  } catch (err) {
    res.status(500).json({message: err.message});
  }
};

module.exports = validateSeller;