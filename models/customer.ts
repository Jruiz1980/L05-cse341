// models/Customer.ts
import mongoose, { Schema, Document } from 'mongoose';

interface ICustomer extends Document {
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  storeName: string;
}

const CustomerSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String },
  storeName: { type: String, required: true },
});

const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;