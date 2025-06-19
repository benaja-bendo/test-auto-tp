import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './Customer';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.addresses)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({
    type: 'varchar',
    enum: ['billing', 'shipping'],
  })
  type: 'billing' | 'shipping';

  @Column({
    type: 'varchar',
    length: 255,
  })
  street: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  city: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  postalCode: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  country: string;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
