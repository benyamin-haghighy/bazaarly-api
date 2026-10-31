
import { IsInt, IsPositive } from 'class-validator'

export class CreateBookmarkDto {
  @IsInt()
  @IsPositive()
  product_id: number
}