const passport = require('passport');
const Seller = require('../models/seller');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const validator = require('validator'); // For email validation

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://project01-whrs.onrender.com/api-docs'
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile); // Solo para propósitos de depuración
      try {
        const googleId = profile.id;
        const seller = await Seller.findOne({ googleId });
        if (!seller) {
          // El vendedor no existe, crea un nuevo vendedor
          seller = new Seller({
            googleId: profile.id,
            email: validator.isEmail(profile.emails[0].value) ? profile.emails[0].value : '', // Sanitizar email
            name: profile.displayName
            // Agrega cualquier otro campo necesario
          });
          await seller.save();
        }
        return done(null, seller);
      } catch (error) {
        console.error('Error processing Google OAuth callback:', error);
        return done(error);
      }
    }
  )
);
// Serialize y deserialize user
passport.serializeUser(function (seller, done) {
  done(null, seller.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, seller) {
    done(err, seller);
  });
});
