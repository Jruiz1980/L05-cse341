import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';

dotenv.config();

// MongoDB Connection
if (!process.env.MONGODB_URI) {
  throw new Error('The MONGODB_URI environment variable is not defined.');
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Successful connection to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// User Schema and Model Definition
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  googleId: { type: String, required: true },
  role: { type: String, required: true, default: 'client' }, // 'role' field to distinguish between sellers and clients
});

const User = mongoose.model('User', userSchema);

// Seller Schema and Model Definition
const sellerSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Assuming this is the googleId of the user
  // Add any other fields relevant to a seller
});

const Seller = mongoose.model('Seller', sellerSchema);

// Google Authentication Strategy Configuration with Passport
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "https://project01-whrs.onrender.com/auth/google/callback"
  },
  async (accessToken, refreshToken, profile: Profile, cb) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // If the user does not exist, create a new one
        user = new User({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          googleId: profile.id,
        });
      }

      // Check if the user is a seller
      const isSeller = await Seller.findOne({ userId: profile.id });
      user.role = isSeller ? 'seller' : 'client'; // Update the user's role

      await user.save();
      return cb(undefined, user);
    } catch (error) {
      return cb(error, undefined);
    }
  }
));

// User Serialization and Deserialization for Passport Session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err: any, user: boolean | Express.User) => {
    done(err, user);
  });
});

export { User, Seller }; // Export the models for use in other parts of the application