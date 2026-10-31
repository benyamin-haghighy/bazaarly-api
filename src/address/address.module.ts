import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports:[TypeOrmModule.forFeature([Address]),AuthModule,UsersModule],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
