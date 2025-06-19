export interface Address {
  id: number;
  customerId: number;
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  postalCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AddressEntity implements Address {
  id: number;
  customerId: number;
  type: 'billing' | 'shipping';
  street: string;
  city: string;
  postalCode: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Address>) {
    Object.assign(this, data);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}