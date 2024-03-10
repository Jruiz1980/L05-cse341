import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Customer from '../models/customer'; // Ajusta la ruta según sea necesario

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Customer.find({});
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getSingle = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Customer.findById(req.params.id);
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createCustomer = [
  body('firstName').notEmpty().withMessage('The first name field is required.'),
  body('lastName').notEmpty().withMessage('The last name field is required.'), 
  body('email').isEmail().withMessage('The email field must be a valid email.'), 
  body('address').optional().isString(), 
  body('storeName').notEmpty().withMessage('The store name field is required.'), 
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: errors.array()
      });
      return;
    }
    try {
      const customer = new Customer(req.body);
      const response = await customer.save();
      res.status(201).json(response);
    } catch (err) {
      res.status(500).json(err.message || 'Some error occurred while creating the customer.');
    }
  }
];

const updateCustomer = [
  // Validaciones
  body('firstName').notEmpty().withMessage('The first name field is required.'),
  body('lastName').notEmpty().withMessage('The last name field is required.'),
  body('email').isEmail().withMessage('The email field must be a valid email.'),
  body('address').optional().isString(),
  body('storeName').notEmpty().withMessage('The store name field is required.'),
  // Controlador
  async (req: Request, res: Response): Promise<void> => {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: errors.array()
      });
      return;
    }

    const customerId = req.params.id;
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      address: req.body.address,
      storeName: req.body.storeName,
    };

    try {
      // Actualizar el cliente
      const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updateData, {
        new: true, // Esto retorna el documento modificado en lugar del original
        runValidators: true, // Ejecutar validaciones definidas en el esquema de Mongoose
      });

      if (updatedCustomer) {
        res.status(200).json(updatedCustomer);
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      res.status(500).json({
        message: 'Error updating customer',
        error: error.message,
      });
    }
  }
];


const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
    const customerId = req.params.id; // Obtiene el ID del cliente desde el parámetro de la ruta

    try {
        const deletedCustomer = await Customer.findByIdAndDelete(customerId);

        if (deletedCustomer) {
            res.status(200).json({ message: 'Customer successfully deleted', deletedCustomer });
        } else {
            // Si no se encuentra el cliente con el ID proporcionado, responde con un error 404
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        // En caso de error en la operación de la base de datos, responde con un error 500
        res.status(500).json({
            message: 'Error deleting customer',
            error: error.message,
        });
    }
};


export { getAll, getSingle, createCustomer, updateCustomer, deleteCustomer };
