import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity({name:"tickets"})
export class Ticket {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    title:string
    @Column()
    subject:string
    @Column()
    descryption:string
    @Column()
    user_id:number
    @Column({nullable:true})
    reply_id:number
    @ManyToOne(()=>User, (user)=>user.tickets)
    @JoinColumn({name:"user_id"})
    user:User
    @ManyToOne(()=>Ticket, (ticket)=>ticket.replies,{nullable:true,onDelete:"CASCADE"})
    @JoinColumn({name:'reply_id'})
    reply:Ticket
    @OneToMany(()=>Ticket, (ticket)=>ticket.reply)
    replies:Ticket[]
}
