const express = require('express');
const bodyParser = require('body-parser');
const passport =  require('passport');
require('./config/passport-setup');
const mongodb = require('./db/connect');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');
const cors = require('cors');
//const mongoose = require('mongoose');

require('dotenv').config();

const port = process.env.PORT || 8080;
const app = express();
app.use(morgan('dev'));
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('My service is online');
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ 
      mongoUrl: process.env.MONGODB_URI })
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
  if (!req.isAuthenticated()) {
    return res.status(401).send('User not authenticated')
  }
  if (req.user.seller) {
    return next();
  }
  return res.status(403).send('Denied Access')
}

// Usar el middleware en tus rutas
app.post('/post/customers', checkSellerRole, (req, res) => {
  // Lógica para manejar la petición
  res.send('POST operation success');
});

app.put('/put/customers', checkSellerRole, (req, res) => {
  // Lógica para manejar la petición
  res.send('PUT operation success');
});

app.delete('/delete/customers', checkSellerRole, (req, res) => {
  // Lógica para manejar la petición
  res.send('DELETE operation success');
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
