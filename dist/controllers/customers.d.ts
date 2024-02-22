import { Request, Response } from 'express';
declare const getAll: (req: Request, res: Response) => Promise<void>;
declare const getSingle: (req: Request, res: Response) => Promise<void>;
declare const createCustomer: (import("express-validator").ValidationChain | ((req: Request, res: Response) => Promise<void>))[];
declare const updateCustomer: (import("express-validator").ValidationChain | ((req: Request, res: Response) => Promise<void>))[];
declare const deleteCustomer: (req: Request, res: Response) => Promise<void>;
export { getAll, getSingle, createCustomer, updateCustomer, deleteCustomer };
