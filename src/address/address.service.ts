import { Injectable, NotAcceptableException, NotFoundException, UseGuards } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly userService: UsersService
  ) { }
  async create(createAddressDto: CreateAddressDto, user: JwtPayload): Promise<Address> {
    const address = await this.addressRepository.create({ ...createAddressDto, user_id: user.sub })
    return this.addressRepository.save(address)
  }

  async findAll(user: JwtPayload): Promise<Address[]> {
    try {
      await this.userService.findOne(user.sub, user)
      const addressers = await this.addressRepository.find({
        where: { user_id: user.sub }, relations: { user: true }, select: {
          user: {
            id: true,
            name: true,
            mobile: true,
            role: true
          }
        }
      })
      return addressers
    } catch (error) {
      throw error
    }
  }

  async findOne(id: number, user: JwtPayload): Promise<Address> {
    try {
      await this.userService.findOne(user.sub, user)
      const address = await this.addressRepository.findOne({
        where: {
          id
        },
        relations: { user: true },
        select: {
          user: {
            id: true,
            name: true,
            mobile: true,
            role: true
          }
        }
      })
      if (!address) {
        throw new NotFoundException("ادرسی با این ایدی پیدا نشدش")
      }
      if (address.user_id !== user.sub) {
        throw new NotAcceptableException('این ادرس برای این شخص نیستش')
      }
      return address
    } catch (error) {
      throw error
    }
  }

  async update(id: number, updateAddressDto: UpdateAddressDto, user: JwtPayload): Promise<string> {
    try {
      await this.findOne(id, user)
      const result = await this.addressRepository.update(id, updateAddressDto)
      console.log(result);
      return 'address update successFully'
    } catch (error) {
      throw error
    }
  }

  async remove(id: number, user: JwtPayload): Promise<string> {
    try {
      await this.findOne(id, user)
      await this.addressRepository.delete(id)
      return `address removes wuth id = ${id} successfully`;
    } catch (error) {
      throw error
    }
  }
}