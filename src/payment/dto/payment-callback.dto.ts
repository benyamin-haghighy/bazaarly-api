// payments/dto/payment-callback.dto.ts
import { Transform, Type } from 'class-transformer'
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator'

export class PaymentCallbackDto {
  @Type(() => Number)
  @IsIn([0, 1])
  success: number

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  trackId: number

  @IsOptional()
  @IsString()
  orderId?: string

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  status?: number
}