const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport =  require('passport');
require('./config/passport-setup');
const mongodb = require('./db/connect');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 8080;
const app = express();
app.use(morgan('dev'));
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

app.get(
  '/auth/google/redirect',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successfull authentication.
    res.redirect('/');
  }
);

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', require('./routes'));


function checkSellerRole(req, res, next) {
  if (req.isAuthenticated() && req.user.seller) {
    // Asumiendo que `seller` es una propiedad del usuario
    return next();
  }
  res.status(403).send('Acceso denegado');
}

// Usar el middleware en tus rutas
app.post('/ruta-protegida', checkSellerRole, (req, res) => {
  // Lógica para manejar la petición
});

app.use((err, req, res, next) => {
  console.error('Error message: ', err.message);
  console.error('Stack trace: ', err.stack);
  res.status(500).send('Something broke!');
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);

});

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
