import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import roleFind from './enums/roleFind.enum';
import role from './enums/roleUser.enum.';
import { pageNation } from './dto/pageNation.dto';
import { JwtPayload } from '../tickets/interfaces/jwtpayload.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }
  async create(createUserDto: CreateUserDto): Promise<object> {
    const isUser = await this.userRepository.findOne({ where: { mobile: createUserDto.mobile } })
    if (isUser) {
      throw new BadRequestException('کاربری با این شماره تلفن قبلا ثیت نام کرده است')
    }
    const hashPassword = await hash(createUserDto.password, 10)
    createUserDto.password = hashPassword
    // createUserDto.role = roleFind.USER
    const user = this.userRepository.create(createUserDto)
    const { password, ...userDetail } = await this.userRepository.save(user)
    return userDetail
  }
  findAll(pageNation: pageNation): Promise<User[]> {
    return this.userRepository.find({
      order: { id: "desc" },
      skip: (pageNation.page - 1) * pageNation.limit,
      take: pageNation.limit ? pageNation.limit : 10,
    })
  }
  findAllWithRole(role: roleFind, pageNation: pageNation): Promise<User[]> {
    return this.userRepository.find({
      where: { role }, order: { id: "desc" },
      skip: (pageNation.page - 1) * pageNation.limit,
      take: pageNation.limit ? pageNation.limit : 10,
    })
  }

  async findOne(id: number, userDetail: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException('کاربری با این ایدی پیدا نشده است')
    }

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto, user: JwtPayload): Promise<string> {
    const isUser = await this.findOne(id, user)
    if (Number(isUser.id) === Number(user.sub) || user.role === roleFind.ADMIN) {
      const result = await this.userRepository.update(id, updateUserDto)
    } else {
      throw new ForbiddenException('شما دسترسی به اپدیت کردن اطلاعات این شخص را ندارید')
    }
    return `user updates with id = ${id}`;
  }

  async remove(id: number, user: JwtPayload): Promise<string> {
    const isUser = await this.findOne(id, user)
    if (Number(isUser.id) === Number(user.sub) || user.role === roleFind.ADMIN) {
      const result = await this.userRepository.delete(id)
    } else {
      throw new ForbiddenException('شما دسترسی به اپدیت کردن اطلاعات این شخص را ندارید')
    }
    return `user with id = ${id} remove`;
  }
}
