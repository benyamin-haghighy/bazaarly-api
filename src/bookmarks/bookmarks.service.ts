import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Bookmark } from './entities/bookmark.entity'
import { Product } from '../products/entities/product.entity'
import { CreateBookmarkDto } from './dto/create-bookmark.dto'
import { JwtPayload } from '../tickets/interfaces/jwtpayload.interface'

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(dto: CreateBookmarkDto, user: JwtPayload) {
    const productExists = await this.productRepository.exists({
      where: { id: dto.product_id },
    })
    if (!productExists) {
      throw new NotFoundException('محصولی با این شناسه پیدا نشد')
    }

    const alreadyBookmarked = await this.bookmarkRepository.exists({
      where: { product_id: dto.product_id, user_id: user.sub },
    })
    if (alreadyBookmarked) {
      throw new BadRequestException('این محصول قبلاً بوکمارک شده است')
    }

    const bookmark = this.bookmarkRepository.create({
      product_id: dto.product_id,
      user_id: user.sub,
    })
    return this.bookmarkRepository.save(bookmark)
  }

  async findAll(user: JwtPayload) {
    return this.bookmarkRepository.find({
      where: { user_id: user.sub },
      relations: { product: true, user:true },
      order: { id: 'DESC' },
    })
  }

  async findOne(id: number, user: JwtPayload) {
    const bookmark = await this.bookmarkRepository.findOne({
      where: { id },
      relations: { product: true },
    })
    if (!bookmark) {
      throw new NotFoundException('بوکمارکی با این شناسه پیدا نشد')
    }
    if (bookmark.user_id !== user.sub) {
      throw new ForbiddenException('شما دسترسی به این بوکمارک را ندارید')
    }
    return bookmark
  }

  async remove(id: number, user: JwtPayload) {
    await this.findOne(id, user)
    await this.bookmarkRepository.delete(id)
    return { message: 'بوکمارک با موفقیت حذف شد' }
  }
}