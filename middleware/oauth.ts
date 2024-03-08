import * as passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import * as dotenv from 'dotenv';
dotenv.config();

const emails = ["johnathanruiz@gamil.com"];

passport.use(
  "auth-google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://project01-whrs.onrender.com",
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