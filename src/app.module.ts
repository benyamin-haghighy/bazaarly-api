import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config"
import {TypeOrmModule} from "@nestjs/typeorm"
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { TicketsModule } from './tickets/tickets.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { BasketModule } from './basket/basket.module';
import { OrdersModule } from './orders/orders.module';
import { DiscountCodeModule } from './discount-code/discount-code.module';
import { PaymentModule } from './payment/payment.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRoot({
      type:"mysql",
      host:process.env.DB_HOST,
      port:Number(process.env.DB_PORT || 3306),
      database:process.env.DB_NAME,
      username:process.env.DB_USERNAME,
      password:process.env.DB_PASSWORD,
      autoLoadEntities:true,
      synchronize:true
    }),
    UsersModule,
    AuthModule,
    AddressModule,
    TicketsModule,
    ProductsModule,
    CategoryModule,
    BookmarksModule,
    BasketModule,
    OrdersModule,
    DiscountCodeModule,
    PaymentModule,
  ]
})
export class AppModule {}
