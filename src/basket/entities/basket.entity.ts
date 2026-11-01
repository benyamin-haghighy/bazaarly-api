import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Product } from "../../products/entities/product.entity";

@Entity('baskets')
@Unique(['product_id', 'user_id'])
export class Basket {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    product_id:number
    @Column()
    user_id:number
    @Column()
    quantity:number
    @CreateDateColumn()
    created_at:Date
    @UpdateDateColumn()
    updated_at:Date
    @ManyToOne(()=>User, (user)=>user.basket)
    @JoinColumn({name:"user_id"})
    user:User
    @ManyToOne(()=>Product, (product)=>product.baskets)
    @JoinColumn({name:"product_id"})
    item:Product
}
