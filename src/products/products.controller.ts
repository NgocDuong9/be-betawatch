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
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Trang hiện tại',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng sản phẩm mỗi trang',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'ID danh mục',
  })
  @ApiQuery({
    name: 'tags',
    required: false,
    type: String,
    description: 'Tags (phân cách bằng dấu phẩy)',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Trạng thái hoạt động',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Từ khóa tìm kiếm',
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('tags') tags?: string,
    @Query('isActive') isActive?: boolean,
    @Query('search') search?: string,
  ) {
    try {
      const query: any = {};

      if (page) query.page = page;
      if (limit) query.limit = limit;
      if (category) query.category = category;
      if (tags) query.tags = tags.split(',').map((tag) => tag.trim());
      if (isActive !== undefined) query.isActive = isActive;
      if (search) query.search = search;

      const result = await this.productsService.findAll(query);

      return {
        message: 'Lấy danh sách sản phẩm thành công',
        data: result.products,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit),
        },
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Tìm kiếm sản phẩm' })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Từ khóa tìm kiếm',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Trang hiện tại',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng sản phẩm mỗi trang',
  })
  async searchProducts(
    @Query('q') searchTerm: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    try {
      const query: any = {};
      if (page) query.page = page;
      if (limit) query.limit = limit;

      const result = await this.productsService.searchProducts(
        searchTerm,
        query,
      );

      return {
        message: 'Tìm kiếm sản phẩm thành công',
        data: result.products,
        pagination: {
          total: result.total,
          page: page || 1,
          limit: limit || 10,
          totalPages: Math.ceil(result.total / (limit || 10)),
        },
        searchTerm,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm' })
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.productsService.findOne(id);
      return {
        message: 'Lấy chi tiết sản phẩm thành công',
        data,
        statusCode: 200,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  async create(
    @Body() createProductDto: CreateProductDto,
    @Request() req: any,
  ) {
    try {
      const userId = req.user?.id;
      const data = await this.productsService.create(createProductDto, userId);
      return {
        message: 'Tạo sản phẩm thành công',
        data,
        statusCode: 201,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Dữ liệu không hợp lệ');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req: any,
  ) {
    try {
      const userId = req.user?.id;
      const data = await this.productsService.update(
        id,
        updateProductDto,
        userId,
      );
      return {
        message: 'Cập nhật sản phẩm thành công',
        data,
        statusCode: 200,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Dữ liệu không hợp lệ hoặc lỗi hệ thống');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  async delete(@Param('id') id: string) {
    try {
      const data = await this.productsService.delete(id);
      return {
        message: 'Xóa sản phẩm thành công',
        data,
        statusCode: 200,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Lấy sản phẩm theo danh mục' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Trang hiện tại',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng sản phẩm mỗi trang',
  })
  async getByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    try {
      const query: any = {};
      if (page) query.page = page;
      if (limit) query.limit = limit;

      const result = await this.productsService.findByCategory(
        categoryId,
        query,
      );

      return {
        message: 'Lấy sản phẩm theo danh mục thành công',
        data: result.products,
        pagination: {
          total: result.total,
          page: page || 1,
          limit: limit || 10,
          totalPages: Math.ceil(result.total / (limit || 10)),
        },
        categoryId,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }

  @Post('tags')
  @ApiOperation({ summary: 'Lấy sản phẩm theo tags' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Trang hiện tại',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số lượng sản phẩm mỗi trang',
  })
  async getByTags(
    @Body('tags') tags: string[],
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    try {
      const query: any = {};
      if (page) query.page = page;
      if (limit) query.limit = limit;

      const result = await this.productsService.findByTags(tags, query);

      return {
        message: 'Lấy sản phẩm theo tags thành công',
        data: result.products,
        pagination: {
          total: result.total,
          page: page || 1,
          limit: limit || 10,
          totalPages: Math.ceil(result.total / (limit || 10)),
        },
        tags,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Lỗi hệ thống');
    }
  }
}
