// discount-codes/entities/discount-code.entity.ts
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Order } from '../../orders/entities/order.entity'

@Entity('discount_codes')
export class DiscountCode {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  code: string

  @Column({ type: 'int', unsigned: true })
  percent: number

  @Column({ type: 'timestamp' })
  expires_at: Date

  @Column({ type: 'int', unsigned: true, default: 1 })
  usage_limit: number

  @Column({ type: 'int', unsigned: true, default: 0 })
  used_count: number

  @CreateDateColumn()
  created_at: Date

  @OneToMany(() => Order, (order) => order.discount_code)
  orders: Order[]
}