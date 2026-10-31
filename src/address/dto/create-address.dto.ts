import { Transform } from 'class-transformer';
import {
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsInt,
} from 'class-validator';

export class CreateAddressDto {
  @IsString({ message: 'استان باید به‌صورت رشته وارد شود.' })
  @IsNotEmpty({ message: 'وارد کردن استان الزامی است.' })
  province: string;

  @IsString({ message: 'شهر باید به‌صورت رشته وارد شود.' })
  @IsNotEmpty({ message: 'وارد کردن شهر الزامی است.' })
  city: string;

  @IsString({ message: 'آدرس باید به‌صورت رشته وارد شود.' })
  @IsNotEmpty({ message: 'وارد کردن آدرس الزامی است.' })
  address: string;

  @IsString({ message: 'کد پستی باید به‌صورت رشته وارد شود.' })
  @IsNotEmpty({ message: 'وارد کردن کد پستی الزامی است.' })
  @Length(10, 10, {
    message: 'کد پستی باید دقیقاً ۱۰ کاراکتر باشد.',
  })
  postal_code: string;

  @IsString({ message: 'شماره موبایل باید به‌صورت رشته وارد شود.' })
  @IsNotEmpty({ message: 'وارد کردن شماره موبایل الزامی است.' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsMobilePhone('fa-IR', {}, {
    message: 'شماره موبایل معتبر نیست.',
  })
  receiver_mobile: string;

  @IsOptional()
  @IsString({ message: 'توضیحات باید به‌صورت رشته وارد شود.' })
  descryption?: string;
}