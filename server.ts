const session = require('express-session');
import mongoose from 'mongoose';
import * as mongodb from './db/connect';
const passport = require('passport');
const cors = require('cors');
import helmet from 'helmet';
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';

dotenv.config();
const app = express();
const port = process.env.PORT


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(err => console.error('No se pudo conectar a MongoDB:', err));

app.use(morgan('dev'));

app
  .use(bodyParser.json())
  .use((req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', routes);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
  })
}));

app.use(passport.initialize());
app.use(passport.session());

// Middlewares
app.use(morgan('dev')); // Logging
app.use(helmet()); // Seguridad básica
app.use(cors()); // Configuración de CORS
app.use(express.json()); // Parseo de JSON
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 solicitudes por ventana (aquí, por 15 minutos)
});
app.use(limiter);


// Google Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req: any, res: { redirect: (arg0: string) => void; }) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.use((err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  console.error('Error message: ', err.message);
  console.error('Stack trace: ', err.stack);
  res.status(500).send('Something broke!');
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});


mongodb.initDb((err: any) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
