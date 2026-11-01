import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import role from "../enums/roleUser.enum.";
import { Address } from "../../address/entities/address.entity";
import { Ticket } from "../../tickets/entities/ticket.entity";
import { Bookmark } from "../../bookmarks/entities/bookmark.entity";
import { Basket } from "../../basket/entities/basket.entity";
import { Order } from "../../orders/entities/order.entity";

@Entity({name:'users'})
export class User {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    name:string
    @Column({unique:true})
    mobile:string
    @Column({nullable:true})
    password:string
    @Column({type:"enum", enum:role, default:role.USER})
    role:role
    @CreateDateColumn()
    created_at:Date
    @UpdateDateColumn()
    updated_at:Date
    @OneToMany(()=>Address, (address)=>address.user)
    addresses:Address[]
    @OneToMany(()=>Ticket, (ticket)=>ticket.user)
    tickets:Ticket[]
    @OneToMany(()=>Bookmark, (bookmark)=>bookmark.user)
    bookMarks:Bookmark[]
    @OneToMany(()=>Basket, (basket)=> basket.user)
    basket:Basket[]
    @OneToMany(() => Order, (order) => order.user)
    orders: Order[]

}
