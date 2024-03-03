// middleware/oauth.ts
import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

const validateOAuthToken = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://YOUR_DOMAIN/.well-known/jwks.json`
  }),
  audience: 'YOUR_AUDIENCE',
  issuer: `https://YOUR_DOMAIN/`,
  algorithms: ['RS256']
});

export { validateOAuthToken };