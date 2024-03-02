// In routes/oauth.ts
import * as express from 'express';
import { generateToken } from '../controllers/oauth';

const router: express.Router = express.Router();

router.post('/token', generateToken);

export default router;
