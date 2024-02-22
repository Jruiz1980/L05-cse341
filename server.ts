import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import * as mongodb from './db/connect';
// import your routes module properly if it has a default export or named exports

const port: string | number = process.env.PORT || 8080;
const app = express();

app
  .use(bodyParser.json())
  .use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  // use appropriate import for your routes
  .use('/', require('./routes')); 


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error message: ', err.message);
  console.error('Stack trace: ', err.stack);
  res.status(500).send('Something broke!');
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

mongodb.initDb((err: any, mongodb: any) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});