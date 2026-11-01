// orders/entities/order-item.entity.ts
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { Order } from './order.entity'
import { Product } from '../../products/entities/product.entity'

@Entity('order_items')
@Unique(['order_id', 'product_id'])
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  order_id: number

  @Column()
  product_id: number

  @Column({ type: 'int', unsigned: true })
  quantity: number

  @Column({ type: 'int', unsigned: true })
  price: number // قیمت واحد در لحظه‌ی خرید

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ManyToOne(() => Product, (product) => product.orderItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: Product
}