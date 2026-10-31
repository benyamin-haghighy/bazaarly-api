import { PartialType, PickType } from '@nestjs/mapped-types';
import { ResgisterAuthDto } from './resgister-auth.dto';

export class LgoinAuthDto extends PickType(ResgisterAuthDto, ['mobile', 'password'] as const) {
}
