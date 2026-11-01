// discount-codes/discount-codes.service.ts
import { randomBytes } from 'crypto'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { DiscountCode } from './entities/discount-code.entity'
import { CreateDiscountCodeDto } from './dto/create-discount-code.dto'

@Injectable()
export class DiscountCodesService {
  constructor(
    @InjectRepository(DiscountCode)
    private readonly discountRepository: Repository<DiscountCode>,
  ) {}

  async create(dto: CreateDiscountCodeDto) {
    let code = ''
    for (let i = 0; i < 5; i++) {
      const candidate = randomBytes(4).toString('hex').toUpperCase()
      const exists = await this.discountRepository.exists({ where: { code: candidate } })
      if (!exists) {
        code = candidate
        break
      }
    }
    if (!code) {
      throw new BadRequestException('ساخت کد ناموفق بود، دوباره تلاش کنید')
    }

    const expires_at = new Date(Date.now() + dto.valid_for_minutes * 60 * 1000)
    const discount = this.discountRepository.create({
      code,
      percent: dto.percent,
      expires_at,
      usage_limit: dto.usage_limit ?? 1,
    })
    return this.discountRepository.save(discount)
  }

  findAll() {
    return this.discountRepository.find({ order: { id: 'DESC' } })
  }

  // بررسی کد و محاسبه‌ی تخفیف؛ چیزی را ذخیره نمی‌کند
  async validateCode(code: string, orderTotal: number) {
    const discount = await this.discountRepository.findOne({ where: { code } })
    if (!discount) {
      throw new NotFoundException('کد تخفیف نامعتبر است')
    }
    if (discount.expires_at < new Date()) {
      throw new BadRequestException('این کد تخفیف منقضی شده است')
    }
    if (discount.used_count >= discount.usage_limit) {
      throw new BadRequestException('ظرفیت استفاده از این کد تمام شده است')
    }

    const discount_amount = Math.floor((orderTotal * discount.percent) / 100)
    return {
      discount,
      discount_amount,
      final_price: orderTotal - discount_amount,
    }
  }

  // یک بار مصرف، اتمیک؛ موقع ساخت سفارش manager تراکنش را پاس بده
  async consume(id: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(DiscountCode) : this.discountRepository
    const result = await repo
      .createQueryBuilder()
      .update(DiscountCode)
      .set({ used_count: () => 'used_count + 1' })
      .where('id = :id AND used_count < usage_limit AND expires_at > NOW()', { id })
      .execute()

    if (result.affected === 0) {
      throw new BadRequestException('این کد تخفیف دیگر قابل استفاده نیست')
    }
  }
  // discount-codes.service.ts
  async release(id: number, manager?: EntityManager) {
  const repo = manager ? manager.getRepository(DiscountCode) : this.discountRepository
  await repo
    .createQueryBuilder()
    .update(DiscountCode)
    .set({ used_count: () => 'used_count - 1' })
    .where('id = :id AND used_count > 0', { id })
    .execute()
  }
}