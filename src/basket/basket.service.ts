import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBasketDto } from './dto/create-basket.dto';
import { JwtPayload } from '../tickets/interfaces/jwtpayload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Basket } from './entities/basket.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { UpdateBasketDto } from './dto/update-basket.dto';

@Injectable()
export class BasketService {
  constructor(
    private readonly productService:ProductsService,
    @InjectRepository(Basket)
    private readonly basketRepository:Repository<Basket>,
  ){}
  async create(createBasketDto: CreateBasketDto,user:JwtPayload) {
    const product = await this.productService.findOne(createBasketDto.product_id)
    const IsBasketItems = await this.basketRepository.findOne({
      where:{
        user_id:user.sub,
        product_id:createBasketDto.product_id
      },
      relations:{
        item:true
      }
    })
    if (IsBasketItems) {
      throw new BadRequestException('این محصول در سبد خرید شما موجود است')
    }
    const basket = await this.basketRepository.create({...createBasketDto, user_id:user.sub,item:product})
    return this.basketRepository.save(basket)
  }

  findAll(user:JwtPayload) {
    return this.basketRepository.find({
      where:{
        user_id:user.sub
      },
      relations:{
        user:true,
        item:true
      },
      select:{
        user:{
          id:true,
          name:true,
          mobile:true,
          role:true
        }
      }
    })
  }
  async update( id:number,updateBasketDto:UpdateBasketDto,user:JwtPayload){
    const product = await this.productService.findOne(updateBasketDto.product_id)
    const IsBasketItems = await this.basketRepository.findOne({
      where:{
        id,
        user_id:user.sub,
        product_id:updateBasketDto.product_id
      },
      relations:{
        item:true
      }})
    if (!IsBasketItems) {
      throw new BadRequestException("شما نمیتوانید ایتم رو به سبد خرید اضافه کنید")
    }
    IsBasketItems.quantity += updateBasketDto.quantity
    return this.basketRepository.save(IsBasketItems)
  }
  async remove(id: number,user:JwtPayload) {
    const IsBasketItems = await this.basketRepository.findOne({
      where:{
        id,
        user_id:user.sub,
      },
      relations:{
        item:true
      }})
    if (!IsBasketItems) {
      throw new NotFoundException(" سبد خریدی با این ایدی وجود ندارد")
    }
    await this.basketRepository.delete(id)
    return `This basket removeswith id = ${id} successFully`;
  }
}
