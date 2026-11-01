import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Order } from "../../orders/entities/order.entity";

@Entity({name:'addresses'})
export class Address {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    province:string
    @Column()
    city:string
    @Column()
    address:string
    @Column({length:10})
    postal_code:string
    @Column({length:11})
    receiver_mobile:string
    @Column({nullable:true})
    descryption:string
    @Column()
    user_id:number
    @CreateDateColumn()
    created_at:Date
    @UpdateDateColumn()
    update_at:Date
    @ManyToOne(()=>User, (user)=>user.addresses)
    @JoinColumn({name:"user_id"})
    user:User
    @OneToMany(() => Order, (order) => order.address)
    orders: Order[]
}
