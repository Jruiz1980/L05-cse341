const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const validator = require('validator'); // For email validation

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://project01-whrs.onrender.com/auth/google'
    },
    function (accessToken, refreshToken, profile, done) {
      // Log the user profile for debugging purposes (remove in production)
      console.log(profile);

      User.findOne({ googleId: profile.id }, async (err, existingUser) => {
        if (err) {
          console.error('Error finding user:', err);
          return done(err); // Propagate the error to the application
        }

        if (existingUser) {
          // The user already exists in the database
          return done(null, existingUser);
        } else {
          // The user does not exist, create a new user
          const newUser = new User({
            googleId: profile.id,
            email: validator.isEmail(profile.emails[0].value) ? profile.emails[0].value : '', // Sanitize email
            name: profile.displayName // You can add more fields as needed
          });

          try {
            const savedUser = await newUser.save();
            return done(null, savedUser);
          } catch (error) {
            console.error('Error saving user:', error);
            return done(error); // Propagate the error to the application
          }
        }
      });
    }
  )
);

// Serialize y deserialize user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
