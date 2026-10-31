import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { JwtPayload } from '../tickets/interfaces/jwtpayload.interface';

@UseGuards(AuthGuard('jwt'))
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  create(@Req() req:Request & {user:JwtPayload},@Body() createBookmarkDto: CreateBookmarkDto) {
    return this.bookmarksService.create(createBookmarkDto,req.user);
  }

  @Get()
  findAll(@Req() req:Request & {user:JwtPayload},) {
    return this.bookmarksService.findAll(req.user);
  }



  @Delete(':id')
  remove(@Req() req:Request & {user:JwtPayload},@Param('id', ParseIntPipe) id: number) {
    return this.bookmarksService.remove(id,req.user);
  }
}
