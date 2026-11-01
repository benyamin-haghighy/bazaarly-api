// create-order.dto.ts
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator'

export class CreateOrderDto {
  @IsInt()
  @IsPositive()
  address_id: number

  @IsOptional()
  @IsString()
  discount_code_text?: string 
}