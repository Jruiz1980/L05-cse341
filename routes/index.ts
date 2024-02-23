import * as express from 'express';
import customersRoutes from './customers';
import swaggerRoutes from './swagger';

const router: express.Router = express.Router();

router.use('/customers', customersRoutes);
router.use('/', swaggerRoutes);

export default router;