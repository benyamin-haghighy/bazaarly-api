import {  PickType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';

export class UpdateTicketDto extends PickType(CreateTicketDto,['title', 'subject'] as const) {}
