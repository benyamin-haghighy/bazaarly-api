// discount-codes/dto/validate-discount-code.dto.ts
import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator'

export class ValidateDiscountCodeDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString()
  @IsNotEmpty()
  code: string

  @IsInt()
  @IsPositive()
  order_total: number
}