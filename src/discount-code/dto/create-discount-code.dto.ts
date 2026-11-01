// discount-codes/dto/create-discount-code.dto.ts
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class CreateDiscountCodeDto {
  @IsInt()
  @Min(1)
  @Max(100)
  percent: number

  @IsInt()
  @Min(1)
  valid_for_minutes: number

  @IsOptional()
  @IsInt()
  @Min(1)
  usage_limit?: number
}