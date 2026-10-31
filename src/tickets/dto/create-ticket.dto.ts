import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator"


export class CreateTicketDto {
    @IsString()
    @IsNotEmpty()
    "title":string
    @IsString()
    @IsNotEmpty()
    "subject":string
    @IsString()
    @IsNotEmpty()
    "descryption":string
    @IsNumber()
    @IsOptional()
    @IsPositive()
    "reply_id":number
}
