// discount-codes/discount-codes.module.ts
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DiscountCodesService } from './discount-code.service'
import { DiscountCodesController } from './discount-code.controller'
import { DiscountCode } from './entities/discount-code.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DiscountCode])],
  controllers: [DiscountCodesController],
  providers: [DiscountCodesService],
  exports: [DiscountCodesService],
})
export class DiscountCodeModule {}