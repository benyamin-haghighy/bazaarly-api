import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/rder-item.entity';
import { Basket } from '../basket/entities/basket.entity';
import { UsersModule } from '../users/users.module';
import { BasketModule } from '../basket/basket.module';
import { AddressModule } from '../address/address.module';
import { ProductsModule } from '../products/products.module';
import { Product } from '../products/entities/product.entity';
import { DiscountCodeModule } from '../discount-code/discount-code.module';

@Module({
  imports:[UsersModule,DiscountCodeModule,ProductsModule,AddressModule, BasketModule,TypeOrmModule.forFeature([Order, OrderItem,Basket, Product])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports:[OrdersService]
})
export class OrdersModule {}
