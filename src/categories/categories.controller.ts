import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CategoryListResponseDto } from './dto/category-list-response.dto';
import { promises as fs } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
// Nếu có LoggingInterceptor, import ở đây
// import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';

// Helper function to convert Category to CategoryResponseDto
function toCategoryResponseDto(category: any): CategoryResponseDto {
  return {
    _id: category._id?.toString() ?? '',
    name: category.name,
    description: category.description,
    parent: category.parent ? category.parent.toString() : undefined,
    isActive:
      typeof category.isActive === 'boolean' ? category.isActive : undefined,
    createdAt: category.createdAt ? new Date(category.createdAt) : undefined,
    updatedAt: category.updatedAt ? new Date(category.updatedAt) : undefined,
  };
}

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ThrottlerGuard)
// @UseInterceptors(LoggingInterceptor) // Bỏ comment nếu có interceptor
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách category (có phân trang, tìm kiếm)' })
  @ApiResponse({ status: 200, type: CategoryListResponseDto })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(
    @Query()
    query: {
      page?: number;
      limit?: number;
      search?: string;
      isActive?: boolean;
    },
  ): Promise<CategoryListResponseDto> {
    try {
      const result = await this.categoriesService.findAll(query);
      // Chuẩn hóa danh sách trả về
      return {
        items: result.data.map(toCategoryResponseDto),
        total: result.total,
        page: result.page,
        limit: result.limit,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Lỗi lấy danh sách category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết category theo id' })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string): Promise<CategoryResponseDto> {
    try {
      const category = await this.categoriesService.findOne(id);
      if (!category)
        throw new HttpException(
          'Không tìm thấy category',
          HttpStatus.NOT_FOUND,
        );
      return toCategoryResponseDto(category);
    } catch (error) {
      throw new HttpException(
        error.message || 'Lỗi lấy chi tiết category',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('by-partner/:partnerId')
  @ApiOperation({ summary: 'Lấy category theo partnerId' })
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  @ApiParam({ name: 'partnerId', type: String })
  async getByPartner(
    @Param('partnerId') partnerId: string,
  ): Promise<CategoryResponseDto[]> {
    try {
      const categories = await this.categoriesService.getByPartner(partnerId);
      return categories.map(toCategoryResponseDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Lỗi lấy category theo partner',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Tạo mới category (hoặc import từ file)' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, type: [CategoryResponseDto] })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto[]> {
    try {
      const data = await fs.readFile(
        'src/categories/data/category-accessories.json',
        'utf-8',
      );
      const categories = JSON.parse(data) as any[];
      const created: CategoryResponseDto[] = [];
      for (const item of categories) {
        const result = await this.categoriesService.create({
          ...item,
          parent: createCategoryDto?.partner
            ? createCategoryDto?.partner
            : null,
        } as any);
        created.push(toCategoryResponseDto(result));
      }
      return created;
    } catch (error) {
      throw new HttpException(
        error.message || 'Lỗi tạo category',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật category' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    try {
      const updated = await this.categoriesService.update(id, dto);
      return toCategoryResponseDto(updated);
    } catch (error) {
      throw new HttpException(
        error.message || 'Lỗi cập nhật category',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa category' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: CategoryResponseDto })
  async delete(@Param('id') id: string): Promise<CategoryResponseDto> {
    try {
      const deleted = await this.categoriesService.delete(id);
      return toCategoryResponseDto(deleted);
    } catch (error) {
      throw new HttpException(
        error.message || 'Lỗi xóa category',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
