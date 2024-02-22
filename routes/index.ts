import express, { Router } from 'express';
import customersRoutes from './customers';
import swaggerRoutes from './swagger';

const router: Router = express.Router();

router.use('/customers', customersRoutes);
router.use('/', swaggerRoutes);

export default router;