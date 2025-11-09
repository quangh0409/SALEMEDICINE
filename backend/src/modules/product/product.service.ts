import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseService } from '../../shared/base/base.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class ProductService extends BaseService<ProductDocument> {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    return super.create(createProductDto);
  }

  async update(id: ObjectId, updateProductDto: UpdateProductDto): Promise<ProductDocument | null> {
    return super.update(id, updateProductDto);
  }
}