import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './Customer';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @ManyToOne(() => Customer, customer => customer.addresses)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({
    type: 'varchar',
    enum: ['billing', 'shipping']
  })
  type: 'billing' | 'shipping';

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}