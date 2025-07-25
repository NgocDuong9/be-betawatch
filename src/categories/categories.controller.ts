import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { promises as fs } from 'fs';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(
    @Query()
    query: {
      page?: number;
      limit?: number;
      search?: string;
      isActive?: boolean;
    },
  ) {
    try {
      return await this.categoriesService.findAll(query);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category | null> {
    return this.categoriesService.findOne(id);
  }

  @Get('by-partner/:partnerId')
  async getByPartner(@Param('partnerId') partnerId: string) {
    return this.categoriesService.getByPartner(partnerId);
  }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const data = await fs.readFile(
        // 'src/categories/data/categories.seend.json',
        // 'src/categories/data/brands-luxury.json',
        // 'src/categories/data/brands-men.json',
        // 'src/categories/data/brands-women.json',
        // 'src/categories/data/brands-sport.json',
        'src/categories/data/category-accessories.json',
        'utf-8',
      );
      const categories = JSON.parse(data) as any[];
      const created: any[] = [];
      for (const item of categories) {
        const result = await this.categoriesService.create({
          ...item,
          parent: createCategoryDto?.partner
            ? createCategoryDto?.partner
            : null,
        } as any);
        created.push(result);
      }
      return created;
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    try {
      return await this.categoriesService.update(id, dto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Category | null> {
    return this.categoriesService.delete(id);
  }
}
