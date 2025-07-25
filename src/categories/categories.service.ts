import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async findAll(query?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const page = query && Number(query.page) > 0 ? Number(query.page) : 1;
    const limit = query && Number(query.limit) > 0 ? Number(query.limit) : 5;
    const skip = (page - 1) * limit;
    const filter: any = { isDeleted: false };
    if (query && query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }
    if (query && typeof query.isActive === 'boolean') {
      filter.isActive = query.isActive;
    }
    const [data, total] = await Promise.all([
      this.categoryModel.find(filter).skip(skip).limit(limit).lean(),
      this.categoryModel.countDocuments(filter),
    ]);
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoryModel.findById(id).exec();
  }

  async create(dto: any) {
    const newCategory = new this.categoryModel(dto);
    return (await newCategory.save()).toObject();
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<any> {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    Object.assign(category, dto);
    return (await category.save()).toObject();
  }

  async delete(id: string): Promise<any> {
    const category = await this.categoryModel.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    category.isDeleted = true;
    await category.save();
    return category.toObject();
  }

  async getByPartner(partnerId: string): Promise<Category[]> {
    console.log(partnerId);
    return this.categoryModel.find({ parent: partnerId, isDeleted: false });
  }
}
