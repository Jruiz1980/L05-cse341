// collections.ts

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Profile } from 'passport-google-oauth20';
import { Document } from 'mongoose';
dotenv.config();

// Definición de un esquema de usuario
export interface IUser extends Document {
  name: string;
  email: string;
  googleId: string;
}



// Conexión a MongoDB
if (!process.env.MONGODB_URI) {
  throw new Error('La variable de entorno MONGODB_URI no está definida.');
}
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(err => console.error('No se pudo conectar a MongoDB:', err));

// Definición del esquema y modelo de usuario
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  googleId: { type: String, required: true }, // Campo para almacenar el ID de Google
});

const User = mongoose.model<IUser>('User', userSchema);

// Configuración de la estrategia de autenticación de Google con Passport
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "https://project01-whrs.onrender.com/api-docs/auth/google/"
  },
  async (accessToken, refreshToken, profile: Profile, cb) => {
    try {
      // Buscar el usuario en la base de datos por su Google ID
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // Si el usuario no existe, crear uno nuevo con los datos de Google
        user = new User({
          name: profile.displayName,
          email: profile.emails?.[0].value, // Ten en cuenta que profile.emails es un array y puede estar vacío
          googleId: profile.id,
        });
        await user.save(); // Guardar el nuevo usuario en la base de datos
      }
      return cb(undefined, user); // Continuar con el usuario encontrado o creado, usando `undefined` en lugar de `null`
    } catch (error) {
      return cb(error, undefined); // En caso de error, pasar `undefined` como segundo argumento
    }
  }
));

// Serialización y deserialización de usuarios para la sesión de Passport
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user as IUser);
  });
});

export { User }; // Exportar el modelo de usuario para su uso en otras partes de la aplicación