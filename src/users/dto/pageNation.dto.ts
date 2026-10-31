import { IsEnum, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class pageNation{
    @IsInt()
    page:number
    @IsInt()
    limit:number
}