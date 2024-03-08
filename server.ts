import express = require('express');
import session = require('express-session');
import bodyParser = require('body-parser');
import * as mongodb from './db/connect';
import routes from './routes';
import morgan = require('morgan');
import { loginRouter } from './routes/oauth';
import "./middleware/oauth";
import * as passport from 'passport';
import './models/collections';
import MongoStore from 'connect-mongo';


const port: string | number = process.env.PORT || 8080;
const app = express();

app.use(morgan('dev'));

app
  .use(bodyParser.json())
  .use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', routes);

app.use(session({
  secret: 'secret', // Cambia esto por una clave secreta real en tu entorno de producción
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    autoRemove: 'native'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  "/auth",
  passport.authenticate("auth-google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    session: false,
  }),
  loginRouter
);
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
