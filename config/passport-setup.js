const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
dotenv.config();


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://project01-whrs.onrender.com/auth/google'
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      User.findOne({ googleId: profile.id }, async (err, existingUser) => {
        if (err) return done(err);
        if (existingUser) {
          // El usuario ya existe en la base de datos
          return done(null, existingUser);
        } else {
          // El usuario no existe, crea un nuevo usuario
          const newUser = new User({
            googleId: profile.id,
            email: profile.emails[0].value, // Asegúrate de solicitar el permiso para acceder al correo electrónico
            name: profile.displayName
            // Puedes agregar más campos según tu modelo de usuario
          });
          try {
            const savedUser = await newUser.save();
            return done(null, savedUser);
          } catch (error) {
            return done(error);
          }
        }
      });
    }
  )
);

// Serialize y deserialize user
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, user) {
    done(err, user);
  })
});