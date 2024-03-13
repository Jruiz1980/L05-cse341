// middleware/auth.js
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    req.seller = rqe.email.seller;
    return next();
  }
  res.status(401).send({ message: 'Do not authorized' });
};

module.exports = {
  isAuthenticated}
