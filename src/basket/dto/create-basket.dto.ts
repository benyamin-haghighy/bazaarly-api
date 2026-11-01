import { IsInt, IsNotEmpty, Min } from "class-validator"

export class CreateBasketDto {
    @IsNotEmpty()
    @IsInt()
    product_id:number
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantity:number
}
