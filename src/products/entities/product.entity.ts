import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "../../category/entities/category.entity";
import { Bookmark } from "../../bookmarks/entities/bookmark.entity";

@Entity({name:"products"})
export class Product {
    @PrimaryGeneratedColumn()
    id:number
    @Column({unique:true})
    title:string
    @Column({type:"decimal",unsigned:true})
    price:number
    @Column()
    descryption:string
    @Column({unsigned:true})
    stock:number
    @CreateDateColumn()
    created_at:Date
    @UpdateDateColumn()
    updated_at:Date
    @ManyToMany(()=> Category, (category)=>category.products)
    @JoinTable({
        name:"products_categories",
        joinColumn:{name:"product_id", referencedColumnName:"id"},
        inverseJoinColumn:{name:"category_id", referencedColumnName:"id"}
    })
    categories:Category[]
    @OneToMany(()=>Bookmark, (bookmark)=>bookmark.product)
    bookMarks:Bookmark[]
}
