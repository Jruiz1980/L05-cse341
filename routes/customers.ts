import * as express from 'express';
import {
  getAll,
  getSingle,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customers';
import { verifyAuth } from '../middleware/oauth';

import { validations, handleValidationErrors } from '../middleware/validate';


const router: express.Router = express.Router();

router.get('/', getAll);
router.get('/:id', getSingle);
router.post('/', verifyAuth, validations, handleValidationErrors, createCustomer);
router.put('/:id', verifyAuth, validations, handleValidationErrors, updateCustomer);
router.delete('/:id', verifyAuth, deleteCustomer);


export default router;
