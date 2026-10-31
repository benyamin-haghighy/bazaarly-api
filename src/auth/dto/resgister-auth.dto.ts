import {
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ResgisterAuthDto {
    @IsNotEmpty({ message: 'نام نمی‌تواند خالی باشد' })
      @IsString({ message: 'نام باید به‌صورت متن باشد' })
      @Transform(({value})=>value.trim())
      name: string;
    
      @IsNotEmpty({ message: 'شماره موبایل نمی‌تواند خالی باشد' })
      @IsString({ message: 'شماره موبایل باید به‌صورت متن باشد' })
      @IsMobilePhone('fa-IR', {}, { message: 'شماره موبایل معتبر نیست' })
      @Transform(({value})=>value.trim())
      mobile: string;
    
      @IsNotEmpty({ message: 'رمز عبور نمی‌تواند خالی باشد' })
      @IsString({ message: 'رمز عبور باید به‌صورت متن باشد' })
      @MinLength(8, { message: 'رمز عبور باید حداقل ۸ کاراکتر باشد' })
      @MaxLength(16, { message: 'رمز عبور نباید بیشتر از ۱۶ کاراکتر باشد' })
      @Transform(({value})=>value.trim())
      password: string;
}
