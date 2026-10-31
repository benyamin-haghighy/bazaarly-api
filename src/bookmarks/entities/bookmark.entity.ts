import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Product } from "../../products/entities/product.entity";

@Entity('bookMarks')
@Unique(['user_id', 'product_id'])
export class Bookmark {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    product_id:number
    @Column()
    user_id:number
    @ManyToOne(()=>User, (user)=>user.bookMarks,{onDelete:'CASCADE'})
    @JoinColumn({name:'user_id'})
    user:User
    @ManyToOne(()=>Product, (product)=>product.bookMarks,{onDelete:'CASCADE'})
    @JoinColumn({name:'product_id'})
    product:Product
}
