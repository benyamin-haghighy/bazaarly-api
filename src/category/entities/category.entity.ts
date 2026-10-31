import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "../../products/entities/product.entity";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    title:string
    @CreateDateColumn()
    created_at:Date
    @UpdateDateColumn()
    updated_at:Date
    @ManyToMany(()=>Product, (product)=>product.categories)
    products:Product[]
}
