import { Request, Response, NextFunction } from 'express';
import { ValidationChain } from 'express-validator';
declare const validations: ValidationChain[];
declare const handleValidationErrors: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export { validations, handleValidationErrors };
