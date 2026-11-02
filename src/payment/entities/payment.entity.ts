import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { payment } from "../enums/payment.enum";
import { User } from "../../users/entities/user.entity";
import { Order } from "../../orders/entities/order.entity";

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    order_id:number
    @Column({unique:true})
    track_id:number
    @Column({ type: 'varchar', nullable: true })
    ref_id: string | null
    @Column()
    user_id:number
    @Column()
    amount:number
    @Column({type:"enum", enum:payment, default:payment.PENDING})
    status:payment
    @Column({type:"timestamp",nullable:true})
    pay_at:Date|null
    @ManyToOne(()=>User, (user)=>user.payments)
    @JoinColumn({name:"user_id"})
    user:User
    @ManyToOne(()=>Order, (order)=>order.payments)
    @JoinColumn({name:"order_id"})
    order:Order
}
