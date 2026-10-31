import { IsArray, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Min } from "class-validator"

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    title:string
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    price:number
    @IsNotEmpty()
    @IsString()
    descryption:string
    @IsNotEmpty()
    @IsInt()
    @IsPositive()
    @Min(0)
    stock:number
    @IsArray()
    @IsInt({each:true})
    @IsPositive({each:true})
    @IsOptional()
    categories:number[]
}
