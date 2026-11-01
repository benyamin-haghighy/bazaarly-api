import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports:[UsersModule, ProductsModule, TypeOrmModule.forFeature([Bookmark, Product])],
  controllers: [BookmarksController],
  providers: [BookmarksService],
})
export class BookmarksModule {}
