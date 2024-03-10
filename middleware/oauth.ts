import { Request, Response, NextFunction } from 'express';
import * as passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { User } from '../models/collections'; // Importing the model

dotenv.config();

const SellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, required: true },
  role: { type: String, required: true, default: "seller" },
});

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const Seller = mongoose.model('Seller', SellerSchema);
const Customer = mongoose.model('Customer', CustomerSchema);


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
  let roles = ["customer"]; // Default role: customer

  // Logic to determine roles based on profile data (replace with your logic)
  if (profile.hasOwnProperty('someField')) { // Check for a specific field indicating seller role
    roles = ["seller"];
  }

  try {
    // Using the imported Seller model
    let seller = await Seller.findOne({ googleId: profile.id });

    if (!seller) {
      seller = new Seller({
        name: profile.displayName,
        email: userEmail,
        googleId: profile.id,
        role: roles[0], // Set role based on logic
      });
      await seller.save();
    }

    done(null, { ...profile, roles }); // Pass profile with roles
  } catch (error) {
    done(error, undefined);
  }
}
  )
)

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