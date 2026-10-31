import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { IsNull, Repository } from 'typeorm';
import { JwtPayload } from './interfaces/jwtpayload.interface';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>
  ) { }
  async create(createTicketDto: CreateTicketDto, user: JwtPayload) {
    try {
      if (createTicketDto.reply_id) {
        await this.findOne(createTicketDto.reply_id, user)
      }
      const ticket = this.ticketRepository.create({ ...createTicketDto, user_id: user.sub })
      return await this.ticketRepository.save(ticket)
    } catch (error) {
      throw error
    }
  }
  async findAll(user: JwtPayload) {
    try {
      const tickets = await this.ticketRepository.find({
        where: {
          user_id: user.sub,
          reply_id: IsNull()
        }, relations: { replies: true,user:true }, select: {
          user:{
            id:true,
            name:true,
            mobile:true,
            role:true
          },
          replies: {
            id: true,
            descryption: true
          },
        }, order: { id: "DESC", replies: { id: "ASC" } }
      })
      if (tickets.length === 0) {
        throw new ForbiddenException('هیچ تیکتی شما ثبت نکردید')
      }
      return tickets
    } catch (error) {
      throw error
    }
  }
  async findOne(id: number, user: JwtPayload) {
    try {
      const ticket = await this.ticketRepository.findOne({
        where: {
          id,
          reply_id: IsNull()
        },
        relations: {
          replies: true,
          user:true
        },
        select:{
          user:{
            id:true,
            name:true,
            mobile:true,
            role:true
          }
        },
        order: { replies: { id: "ASC" } }
      })
      if (!ticket) {
        throw new NotFoundException('تیکتی با این اید یوجود ندارد')
      }
      if (ticket.user_id !== +user.sub) {
        throw new NotAcceptableException('شما دسترسی به این تیکت را ندارید')
      }
      return ticket
    } catch (error) {
      throw error
    }
  }
  async update(id: number, updateTicketDto: UpdateTicketDto, user: JwtPayload) {
    try {
      await this.findOne(id,user)
      await this.ticketRepository.update(id, updateTicketDto)
      return 'update ticket successFully'
    } catch (error) {
      throw error
    }
  }
  async remove(id: number, user: JwtPayload) {
    try {
      await this.findOne(id,user)
      await this.ticketRepository.delete(id)
      return 'ticket remove successFully'
    } catch (error) {
      throw error
    }
  }
}
