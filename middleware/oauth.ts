// middleware/oauth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const validateOAuthToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  // Logic to validate the token
  // If valid, call next() to continue to the next middleware or controller
  // If invalid, return an error response
  
const isValidToken = (token: string): boolean => {
  if (!token) {
    return false;
  }

  
  // Aquí, reemplaza 'your_secret_key' con tu clave secreta real utilizada para firmar los tokens.
  const secretKey = 'AjcoSaPc5S77Lgc8JlUE1lnc+Oy5xQ7aP3gjEl39xjs=';

  try {
    // Verifica el token usando tu clave secreta.
    // Si el token ha expirado o tiene una firma inválida, jwt.verify lanzará un error.
    jwt.verify(token, secretKey);

    // Si no hay errores al verificar, el token es válido.
    return true;
  } catch (error) {
    // Aquí puedes manejar diferentes tipos de errores, por ejemplo, token expirado, firma inválida, etc.
    console.error('Error al validar el token:', error);
    return false;
  }
};


  if (isValidToken(token)) {
    next();
  } else {
    res.status(401).json({ message: 'Invalid or missing token' });
  }
};

export { validateOAuthToken };