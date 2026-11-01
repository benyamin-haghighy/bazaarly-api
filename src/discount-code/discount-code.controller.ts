// discount-codes/discount-codes.controller.ts
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { DiscountCodesService } from './discount-code.service'
import { CreateDiscountCodeDto } from './dto/create-discount-code.dto'
import { ValidateDiscountCodeDto } from './dto/validate-discount-code.dto'

@Controller('discount-codes')
export class DiscountCodesController {
  constructor(private readonly discountCodesService: DiscountCodesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validate(@Body() dto: ValidateDiscountCodeDto) {
    const { discount_amount, final_price } = await this.discountCodesService.validateCode(
      dto.code,
      dto.order_total,
    )
    return { discount_amount, final_price }
  }

  @UseGuards(AuthGuard('adminStrategy'))
  @Post()
  create(@Body() dto: CreateDiscountCodeDto) {
    return this.discountCodesService.create(dto)
  }

  @UseGuards(AuthGuard('adminStrategy'))
  @Get()
  findAll() {
    return this.discountCodesService.findAll()
  }
}