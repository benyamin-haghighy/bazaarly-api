import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtPayload } from '../tickets/interfaces/jwtpayload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/rder-item.entity';
import { In, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Basket } from '../basket/entities/basket.entity';
import { AddressService } from '../address/address.service';
import { DiscountCodesService } from '../discount-code/discount-code.service';
import { OrderStatus } from './enum/order-status.enum';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderitemRepository:Repository<OrderItem>,
    @InjectRepository(Order)
    private readonly orderRepository:Repository<Order>,
    @InjectRepository(Basket)
    private readonly basketRepository:Repository<Basket>,
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>,
    private readonly DiscountCodeService:DiscountCodesService,
    private readonly addressService:AddressService,
    private readonly productService:ProductsService,
  ){}
  async create(createOrderDto: CreateOrderDto, user: JwtPayload) {
  const isOrder = await this.orderRepository.findOne({
    where: {
      user_id: user.sub,
      status: OrderStatus.PENDING,
    },
  })
  if (isOrder) {
    throw new ForbiddenException('شما نمیتوانید سفارش جدید ثبت کنید چون یه سفارش در حال پرداخت دارید')
  }

  const address = await this.addressService.findOne(createOrderDto.address_id, user)

  const baskets = await this.basketRepository.find({
    where: { user_id: user.sub },
    relations: { item: true },
  })
  if (baskets.length === 0) {
    throw new NotFoundException('نمیتوانید سفارش ثبت کنید زیرا سبد خرید شما خالی است')
  }
  
  let total_price = 0
  for (const basket of baskets) {
    if (basket.item.stock < basket.quantity) {
      throw new ForbiddenException(`موجودی «${basket.item.title}» کافی نیست`)
    }
    total_price += basket.quantity * Number(basket.item.price)
  }
  
  let codeDetails: any
  if (createOrderDto.discount_code_text) {
    codeDetails = await this.DiscountCodeService.validateCode(
      createOrderDto.discount_code_text,
      total_price,
    )
  }
  
  let order = this.orderRepository.create({
    discount_code_id: codeDetails ? codeDetails.discount.id : null,
    total_price: codeDetails ? codeDetails.final_price : total_price,
    discount_amount: codeDetails ? codeDetails.discount_amount : 0,
    address_id: address.id,
    user_id: user.sub,
  })
  order = await this.orderRepository.save(order)
  
  const orderItems = baskets.map((basket) =>
    this.orderitemRepository.create({
      price: Number(basket.item.price),
      quantity: basket.quantity,
      product_id: basket.product_id,
      order_id: order.id,
    }),
  )
  await this.orderitemRepository.save(orderItems)

  if (codeDetails) {
    await this.DiscountCodeService.consume(codeDetails.discount.id)
  }
  for (const basket of baskets) {
    await this.productRepository.decrement({ id: basket.product_id }, 'stock', basket.quantity)
  }

  await this.basketRepository.delete({ user_id: user.sub })

  return {
    message: 'order is register successFully',
    order,
  }
}

  async findAll(user:JwtPayload, status?:OrderStatus) {
    const orders = await this.orderRepository.find({
      where:{
        user_id:user.sub,
        status:(status)?status:In([OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.CANCELED])
      },
      relations:{
        items:true,
        address:true,
        discount_code:true
      }
    })
    if (orders.length === 0) {
      throw new NotFoundException('سفارشی پیدا نشد برای لغو کردن')
    }
    return orders
  }

  async findOne(id: number,user:JwtPayload) {
    const order = await this.orderRepository.findOne({
      where:{
        id,
        user_id:user.sub,
      },
      relations:{
        items:true,
        address:true,
        discount_code:true
      }
    })
    if (!order) {
      throw new NotFoundException('سفارشی پیدا نشد برای لغو کردن')
    }
    return order
  }
  async cancleOrder(id: number,user:JwtPayload) {
    const order = await this.orderRepository.findOne({
      where:{
        id,
        user_id:user.sub,
        status:OrderStatus.PENDING
      },
      relations:{
        items:{
          product:true
        }
      }
    })
    if (!order) {
      throw new NotFoundException('سفارشی پیدا نشد برای لغو کردن')
    }
    if (order.discount_code_id) {
      await this.DiscountCodeService.release(order.discount_code_id)
    }
    await this.orderRepository.update(id, {status:OrderStatus.CANCELED})
    for (const p of order.items) {
      await this.productRepository.increment({ id: p.product_id }, 'stock', p.quantity)
    }
    return 'سفارش با موفقیت لغو شد'
  }
  async update(id: number, updateOrderDto: UpdateOrderDto,user:JwtPayload) {
    const order = await this.findOne(id, user)
    if (order.status === updateOrderDto.status) {
      throw new BadRequestException(`وضعیت سفارش شما در حال حاضر برابر ${order.status} است`)
    }
    order.status = updateOrderDto.status
    return this.orderRepository.save(order)
  }

  async remove(id: number,user:JwtPayload) {
    const order = await this.findOne(id, user)
    if (order.status === OrderStatus.PENDING) {
      throw new ForbiddenException('سفارش در جال پرداخت است شما نمیتوانید جذف کنید باید ابتدا سفارش را لفو کنید')
    }
    await this.orderRepository.delete(id)
    return `This order removeswith id = ${id} successFully`;
  }
}
