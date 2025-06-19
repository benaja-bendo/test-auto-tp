import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './Customer';
import { OrderItem } from './OrderItem';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    type: 'int',
  })
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({
    type: 'int',
  })
  carrierId: string;

  @Column({
    type: 'int',
  })
  paymentMethod: string;

  @Column({
    type: 'int',
  })
  shippingAddressId: number;

  @Column({
    type: 'int',
  })
  billingAddressId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  shippingCost: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'varchar',
    default: 'pending',
  })
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

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
