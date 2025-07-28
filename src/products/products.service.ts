import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(query?: {
    page?: number;
    limit?: number;
    category?: string;
    tags?: string[];
    isActive?: boolean;
    search?: string;
  }): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        tags,
        isActive,
        search,
      } = query || {};
      const skip = (page - 1) * limit;

      // Build filter
      const filter: any = { isDeleted: false };

      if (category) {
        if (!Types.ObjectId.isValid(category)) {
          throw new BadRequestException('Category ID không hợp lệ');
        }
        filter.category = new Types.ObjectId(category);
      }

      if (tags && tags.length > 0) {
        filter.tags = { $in: tags };
      }

      if (isActive !== undefined) {
        filter.isActive = isActive;
      }

      if (search) {
        filter.$text = { $search: search };
      }

      const [products, total] = await Promise.all([
        this.productModel
          .find(filter)
          .populate('category', 'name')
          .populate('createdBy', 'username email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.productModel.countDocuments(filter).exec(),
      ]);

      return {
        products,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException('Lỗi khi lấy danh sách sản phẩm');
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Product ID không hợp lệ');
      }

      const product = await this.productModel
        .findById(id)
        .populate('category', 'name')
        .populate('createdBy', 'username email')
        .exec();

      if (!product || product.isDeleted) {
        throw new NotFoundException('Không tìm thấy sản phẩm');
      }

      return product;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Lỗi khi lấy thông tin sản phẩm');
    }
  }

  async create(
    productData: CreateProductDto,
    userId?: string,
  ): Promise<Product> {
    try {
      // Validate category exists
      if (!Types.ObjectId.isValid(productData.category)) {
        throw new BadRequestException('Category ID không hợp lệ');
      }

      // Check if product name already exists
      const existingProduct = await this.productModel.findOne({
        name: productData.name,
        isDeleted: false,
      });

      if (existingProduct) {
        throw new BadRequestException('Tên sản phẩm đã tồn tại');
      }

      // Prepare product data
      const newProductData = {
        ...productData,
        category: new Types.ObjectId(productData.category),
        createdBy: userId ? new Types.ObjectId(userId) : undefined,
        isActive: productData.isActive ?? true,
        stock: productData.stock ?? 0,
        images: productData.images || [],
        tags: productData.tags || [],
        attributes: productData.attributes || [],
      };

      const newProduct = new this.productModel(newProductData);
      const savedProduct = await newProduct.save();

      return this.findOne((savedProduct as any)._id.toString());
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Lỗi khi tạo sản phẩm');
    }
  }

  async update(
    id: string,
    updateData: UpdateProductDto,
    userId?: string,
  ): Promise<Product> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Product ID không hợp lệ');
      }

      // Check if product exists
      const existingProduct = await this.productModel.findById(id);
      if (!existingProduct || existingProduct.isDeleted) {
        throw new NotFoundException('Không tìm thấy sản phẩm');
      }

      // If updating name, check for duplicates
      if (updateData.name && updateData.name !== existingProduct.name) {
        const duplicateProduct = await this.productModel.findOne({
          name: updateData.name,
          _id: { $ne: id },
          isDeleted: false,
        });

        if (duplicateProduct) {
          throw new BadRequestException('Tên sản phẩm đã tồn tại');
        }
      }

      // Prepare update data
      const updatePayload: any = { ...updateData };

      if (updateData.category) {
        if (!Types.ObjectId.isValid(updateData.category)) {
          throw new BadRequestException('Category ID không hợp lệ');
        }
        updatePayload.category = new Types.ObjectId(updateData.category);
      }

      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updatePayload, { new: true })
        .populate('category', 'name')
        .populate('createdBy', 'username email')
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException('Không tìm thấy sản phẩm');
      }

      return updatedProduct as Product;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Lỗi khi cập nhật sản phẩm');
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Product ID không hợp lệ');
      }

      const product = await this.productModel.findById(id);
      if (!product || product.isDeleted) {
        throw new NotFoundException('Không tìm thấy sản phẩm');
      }

      // Soft delete instead of hard delete
      const deletedProduct = await this.productModel
        .findByIdAndUpdate(
          id,
          { isDeleted: true, isActive: false },
          { new: true },
        )
        .populate('category', 'name')
        .populate('createdBy', 'username email')
        .exec();

      return deletedProduct as Product;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException('Lỗi khi xóa sản phẩm');
    }
  }

  async findByCategory(
    categoryId: string,
    query?: { page?: number; limit?: number },
  ): Promise<{ products: Product[]; total: number }> {
    try {
      if (!Types.ObjectId.isValid(categoryId)) {
        throw new BadRequestException('Category ID không hợp lệ');
      }

      const { page = 1, limit = 10 } = query || {};
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        this.productModel
          .find({
            category: new Types.ObjectId(categoryId),
            isDeleted: false,
            isActive: true,
          })
          .populate('category', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.productModel
          .countDocuments({
            category: new Types.ObjectId(categoryId),
            isDeleted: false,
            isActive: true,
          })
          .exec(),
      ]);

      return { products, total };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Lỗi khi lấy sản phẩm theo danh mục');
    }
  }

  async findByTags(
    tags: string[],
    query?: { page?: number; limit?: number },
  ): Promise<{ products: Product[]; total: number }> {
    try {
      if (!tags || tags.length === 0) {
        throw new BadRequestException('Tags không được để trống');
      }

      const { page = 1, limit = 10 } = query || {};
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        this.productModel
          .find({
            tags: { $in: tags },
            isDeleted: false,
            isActive: true,
          })
          .populate('category', 'name')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.productModel
          .countDocuments({
            tags: { $in: tags },
            isDeleted: false,
            isActive: true,
          })
          .exec(),
      ]);

      return { products, total };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Lỗi khi lấy sản phẩm theo tags');
    }
  }

  async searchProducts(
    searchTerm: string,
    query?: { page?: number; limit?: number },
  ): Promise<{ products: Product[]; total: number }> {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new BadRequestException(
          'Từ khóa tìm kiếm phải có ít nhất 2 ký tự',
        );
      }

      const { page = 1, limit = 10 } = query || {};
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        this.productModel
          .find({
            $text: { $search: searchTerm },
            isDeleted: false,
            isActive: true,
          })
          .populate('category', 'name')
          .sort({ score: { $meta: 'textScore' } })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.productModel
          .countDocuments({
            $text: { $search: searchTerm },
            isDeleted: false,
            isActive: true,
          })
          .exec(),
      ]);

      return { products, total };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Lỗi khi tìm kiếm sản phẩm');
    }
  }
}
