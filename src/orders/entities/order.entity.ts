// orders/entities/order.entity.ts
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Address } from '../../address/entities/address.entity'
// import { OrderItem } from './order-item.entity'
import { OrderStatus } from '../enum/order-status.enum'
import { OrderItem } from './rder-item.entity'
import { DiscountCode } from '../../discount-code/entities/discount-code.entity'
import { payment } from '../../payment/enums/payment.enum'
import { Payment } from '../../payment/entities/payment.entity'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  user_id: number

  @Column()
  address_id: number

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus

  @Column({ type: 'int', unsigned: true })
  total_price: number
  @Column({ type: 'int',  nullable: true, default:0 })
  discount_amount: number | null
  @Column({ type: 'int', nullable: true })
  discount_code_id: number | null

  @CreateDateColumn()
  created_at: Date
  @UpdateDateColumn()
  updated_at: Date
  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date | null

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Address, (address) => address.orders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'address_id' })
  address: Address

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[]
  @ManyToOne(() => DiscountCode, (code) => code.orders, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'discount_code_id' })
  discount_code: DiscountCode | null
  @OneToMany(()=>Payment, (pay)=>pay.order)
  payments:Payment[]
}