import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository:Repository<Category>
  ){}
  async create(createProductDto: CreateProductDto) {
    let newCategoies = []
    if (Array.isArray(createProductDto.categories) &&(createProductDto.categories.length > 0)) {
      for (const id of createProductDto.categories) {
        const isCategory = await this.categoryRepository.findOne({where:{id}})
        if (!isCategory) {
          throw new NotFoundException("کتگوری با این ایدی پیدا نشدش")
        }
        newCategoies.push(isCategory)
      }
    }
    const exists = await this.productRepository.exists({ where: { title: createProductDto.title } })
    if (exists) {
      throw new BadRequestException('محصولی با این نام وجود دارد')
    }
    const product = this.productRepository.create({title:createProductDto.title, price:createProductDto.price, categories:newCategoies, descryption:createProductDto.descryption, stock:createProductDto.stock})
    return this.productRepository.save(product)
  }

  findAll() {
    return this.productRepository.find({relations:{
      categories:true
    },select:{
      categories:{
        id:true,
        title:true
      }
    }})
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id },
      relations:{categories:true}
    })
    if (!product) {
      throw new NotFoundException('محصولی با این نام وجود ندارد')
    }
    return product
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id)
    if (Array.isArray(updateProductDto.categories) &&(updateProductDto.categories.length > 0)) {
      for (const categoryId of updateProductDto.categories) {
        const isCategory = await this.categoryRepository.findOne({where:{id:categoryId}})
        if (!isCategory) {
          throw new NotFoundException("کتگوری با این ایدی پیدا نشدش")
        }
        if (!product.categories.some(category=>(category.id === isCategory.id))) {
          product.categories.push(isCategory)
        }
    }
    const {categories,...updateCategory} = updateProductDto
    Object.assign(product, updateCategory)
    return this.productRepository.save(product)
     
  }

  
  }
  async remove(id: number) {
    await this.findOne(id)
    await this.productRepository.delete(id)
    return `This product with id = ${id} remove successFully`;
  }
}