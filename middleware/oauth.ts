import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { User } from '../models/collections'; // Importing the model

dotenv.config();

// Connection using a promise
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Removed user model definition (now imported)
// const userSchema = new mongoose.Schema(...);

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
    async (accessToken, refreshToken, profile, done) => {
      const userEmail = profile.emails?.[0].value; // Handle potential empty array

      try {
        // Using the imported User model
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            name: profile.displayName,
            email: userEmail,
            googleId: profile.id,
          });
          await user.save();
        }

        done(null, user); // Pass the user object instead of profile
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

// ... (rest of the verifyAuth middleware remains unchanged)

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