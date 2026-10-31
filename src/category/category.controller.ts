import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
@UseGuards(AuthGuard('adminStrategy'))
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  async create(@Res() res:Response, @Body() createCategoryDto: CreateCategoryDto) {
    return res.status(HttpStatus.CREATED).json({
      statusCode:HttpStatus.CREATED,
      data:await this.categoryService.create(createCategoryDto),
      message:"category create successfully"
    })
  }  
  @Get()
  async findAll(@Res() res:Response, ) {
    return res.status(HttpStatus.OK).json({
      statusCode:HttpStatus.OK,
      data:await this.categoryService.findAll(),
    })
  }
  @Get(':id')
  async findOne(@Res() res:Response, @Param('id', ParseIntPipe) id: number) {
    return res.status(HttpStatus.OK).json({
      statusCode:HttpStatus.OK,
      data:await this.categoryService.findOne(id),
    })
  }
  @Patch(':id')
  async update(@Res() res:Response, @Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return res.status(HttpStatus.OK).json({
      statusCode:HttpStatus.OK,
      data:await this.categoryService.update(id, updateCategoryDto),
    })
  }
  @Delete(':id')
  async remove(@Res() res:Response, @Param('id', ParseIntPipe) id: number) {
    return res.status(HttpStatus.OK).json({
      statusCode:HttpStatus.OK,
      data:await this.categoryService.remove(id),
    })
  }
}
