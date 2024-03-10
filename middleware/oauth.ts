import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.MONGODB_URI; // Assumes a MongoDB connection URI stored in an environment variable

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

const userSchema = new mongoose.Schema({
  seller: {type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true }
}, { collection: 'sellers' }); // Specify the collection name

const User = mongoose.model('User', userSchema);

interface CustomRequest extends Request {
  user?: { email: string };
}

passport.use(
  "auth-google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://project01-whrs.onrender.com/api-docs",
    },
    function(accessToken, refreshToken, profile, done) {
  const userEmail = profile.emails[0].value;

  // Check if the user's email is authorized (replace with your actual logic)
  mongoose.connection.db.collection('sellers').findOne({ email: userEmail })
    .then(user => {
      if (user) { // User found in the authorized list
        done(null, profile);
      } else {
        done(null, false); // Reject unauthorized users
      }
    })
    .catch(err => done(err, undefined)); // Handle errors during database lookup
}

  )
)

export const verifyAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api-docs')) {
    return next();
  }

  // Check if the user is authenticated and has a valid email in the request object
  if (req.isAuthenticated() && req.user?.email) {
    const userEmail = req.user.email;

    // Database lookup to verify authorization
    mongoose.connection.db.collection('sellers').findOne({ email: userEmail })
      .then(user => {
        if (user) { // User found in the authorized list (sellers collection)
          next();
        } else {
          res.status(403).send('You are not authorized to view this resource');
        }
      })
      .catch(err => {
        console.error('Error during authorization check:', err);
        res.status(500).send('Internal Server Error'); // Handle database errors gracefully
      });
  } else {
    res.status(401).send('Unauthorized'); // User not authenticated
  }
};