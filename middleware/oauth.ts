// oauth.ts
const passport = require('passport');
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mongoose from 'mongoose';
const dotenv = require('dotenv');
import { Request, Response, NextFunction } from 'express';
import { User, Seller } from '../models/collections'; // Adjust the path as needed

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Google OAuth Strategy Configuration with Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "https://project01-whrs.onrender.com/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const userEmail = profile.emails?.[0]?.value;
      if (!userEmail) {
        return done(new Error("An email was not found in the Google profile"), undefined);
      }
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // If the user does not exist, create a new one with Google data
          user = new User({
            name: profile.displayName,
            email: userEmail,
            googleId: profile.id,
          });
          await user.save(); // Save the new user to the database
        }
        done(undefined, user);
      } catch (error) {
        done(error, undefined);
      }
    }
  )
);

// Middleware to verify if the user is authenticated
export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('Unauthorized');
};

// Middleware to verify if the user is a seller
export const verifySeller = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).send('Unauthorized');
  }

  const userEmail = (req.user as any).email;

  Seller.findOne({ email: userEmail }, (err: any, seller: any) => {
    if (err) {
      console.error('Error during seller authorization check:', err);
      return res.status(500).send('Internal Server Error');
    }
    if (seller) {
      next();
    } else {
      res.status(403).send('You are not authorized to perform this action');
    }
  });
};

// User serialization and deserialization for Passport session
passport.serializeUser((user: any, done: (arg0: null, arg1: any) => void) => {
  done(null, user.id);
});

passport.deserializeUser((id: any, done: (arg0: any, arg1: boolean | Express.User) => void) => {
  User.findById(id, (err: any, user: boolean | Express.User) => {
    done(err, user);
  });
});