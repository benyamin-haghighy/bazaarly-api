import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UsersModule } from '../users/users.module';
import { CategoryModule } from '../category/category.module';
import { Category } from '../category/entities/category.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports:[AuthModule, CategoryModule, UsersModule, TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[ProductsService]
})
export class ProductsModule {}
