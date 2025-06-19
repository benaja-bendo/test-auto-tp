export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CustomerEntity implements Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Customer>) {
    Object.assign(this, data);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}