import * as express from 'express';
import {
  getAll,
  getSingle,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customers';

import { validations, handleValidationErrors } from '../middleware/validate';
import { validateOAuthToken } from '../middleware/oauth';

const router: express.Router = express.Router();

router.get('/', getAll);
router.get('/:id', getSingle);
router.post('/', validations, handleValidationErrors, createCustomer);
router.put('/:id', validations, handleValidationErrors, updateCustomer);
router.delete('/:id', deleteCustomer);

router.get('/', validateOAuthToken, getAll);

export default router;
