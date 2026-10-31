import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categotyRepository:Repository<Category>
  ){}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const isCategory = await this.categotyRepository.findOne({where:{title:createCategoryDto.title}})
      if (isCategory) {
        throw new BadRequestException('کتگوری با این اسم وجود دارد')
      }
      const category = this.categotyRepository.create(createCategoryDto)
      return this.categotyRepository.save(category)
    } catch (error) {
      throw error
    }
  }

  findAll() {
    try {
      return this.categotyRepository.find()
    } catch (error) {
      throw error
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categotyRepository.findOne({where:{id},relations:{
        products:true
      },
      select:{
        products:{
          id:true,
          title:true,
          price:true,
          stock:true
        }
      }
    })
    if (!category) {
      throw new NotFoundException('کتگوری با این ایدی پیدا نشدش')
    }
      return category
    } catch (error) {
      throw error
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.ensureExists(id)
      await this.categotyRepository.update(id, updateCategoryDto)
      return 'category update successfully'
    } catch (error) {
      throw error
    }
  }

  async remove(id: number) {
    try {
      await this.ensureExists(id)
      await this.categotyRepository.delete(id)
      return 'category remove successfully' 
    } catch (error) {
      throw error
    }
  }
  private async ensureExists(id: number) {
  const exists = await this.categotyRepository.exists({ where: { id } })
  if (!exists) {
    throw new NotFoundException('دسته‌بندی با این شناسه پیدا نشد')
  }
}
}
