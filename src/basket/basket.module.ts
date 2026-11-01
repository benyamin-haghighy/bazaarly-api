import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basket } from './entities/basket.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[TypeOrmModule.forFeature([Basket]),UsersModule, AuthModule,ProductsModule ],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
