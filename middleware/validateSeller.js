const mongodb = require('../db/connect');
const user = require('../routes/user');
const { ObjectId } = require('mongodb');

const validateSeller = async (req, res, next) => {
  const userId = req.user.id; // Assuming you have the user's ID from the OAuth token
  try {
    const seller = await mongodb.getDb().db().collection('sellers').findOne({ _id: new ObjectId(userId) });
    if (!seller) {
      return res.status(403).json({ message: 'Access denied. User is not a seller.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = validateSeller;