import { IsEnum, IsNotEmpty } from 'class-validator'
import { OrderStatus } from '../enum/order-status.enum'

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus
}