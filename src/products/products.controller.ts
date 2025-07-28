import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  async findAll() {
    try {
      const data = await this.productsService.findAll();
      return {
        message: 'Lấy danh sách sản phẩm thành công',
        data,
        statusCode: 200,
      };
    } catch (error) {
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm' })
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.productsService.findOne(id);
      if (!data) throw new NotFoundException('Không tìm thấy sản phẩm');
      return {
        message: 'Lấy chi tiết sản phẩm thành công',
        data,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const data = await this.productsService.create(createProductDto);
      return { message: 'Tạo sản phẩm thành công', data, statusCode: 201 };
    } catch (error) {
      throw new BadRequestException('Dữ liệu không hợp lệ');
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const data = await this.productsService.update(id, updateProductDto);
      if (!data) throw new NotFoundException('Không tìm thấy sản phẩm');
      return { message: 'Cập nhật sản phẩm thành công', data, statusCode: 200 };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Dữ liệu không hợp lệ hoặc lỗi hệ thống');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  async delete(@Param('id') id: string) {
    try {
      const data = await this.productsService.delete(id);
      if (!data) throw new NotFoundException('Không tìm thấy sản phẩm');
      return { message: 'Xóa sản phẩm thành công', data, statusCode: 200 };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  @Get('category/:categoryId')
  async getByCategory(@Param('categoryId') categoryId: string) {
    return this.productsService.findByCategory(categoryId);
  }

  async getByTags(@Body('tags') tags: string[]) {
    // Đảm bảo tags là mảng
    return this.productsService.findByTags(tags);
  }
}
