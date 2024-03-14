function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    req.seller = req.user.seller;
    return next();
  }
  res.status(401).send({ message: 'Do not authorized' });
};

module.exports = isAuthenticated;
