import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import * as dotenv from 'dotenv';
dotenv.config();

const emails = ["johnathanruiz@gmail.com"];

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
      const response = emails.includes(profile.emails[0].value);

      if (response) {
        done(null, profile);
      } else {
        emails.push(profile.emails[0].value);
        done(null, profile)
      }
    }
  )
)

export const verifyAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user?.email && emails.includes(req.user.email)) {
    next();
  } else {
    res.status(403).send('You are not authorised to modify');
  }
};