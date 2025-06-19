import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Customer } from '../entities/Customer';
import { Address } from '../entities/Address';

export class CustomerService {
  private customerRepository: Repository<Customer>;
  private addressRepository: Repository<Address>;

  constructor() {
    this.customerRepository = AppDataSource.getRepository(Customer);
    this.addressRepository = AppDataSource.getRepository(Address);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.customerRepository.findOne({ where: { email } });
  }

  async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    const customer = this.customerRepository.create(customerData);
    return this.customerRepository.save(customer);
  }

  async addAddress(customerId: number, addressData: Partial<Address>): Promise<Address> {
    const address = this.addressRepository.create({
      ...addressData,
      customerId
    });
    return this.addressRepository.save(address);
  }

  async getCustomerWithAddresses(customerId: number): Promise<Customer | null> {
    return this.customerRepository.findOne({
      where: { id: customerId },
      relations: ['addresses']
    });
  }

  async getAddressByType(customerId: number, type: 'billing' | 'shipping'): Promise<Address | null> {
    return this.addressRepository.findOne({
      where: {
        customerId,
        type
      }
    });
  }
}