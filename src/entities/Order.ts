import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from './Customer';
import { OrderItem } from './OrderItem';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @ManyToOne(() => Customer, customer => customer.orders)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  carrierId: string;

  @Column()
  paymentMethod: string;

  @Column()
  shippingAddressId: number;

  @Column()
  billingAddressId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  shippingCost: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'varchar',
    default: 'pending'
  })
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}