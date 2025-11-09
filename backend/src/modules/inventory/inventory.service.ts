import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/schemas/product.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProductsBelowWarningThreshold(): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.stock < product.warningThreshold')
      .getMany();
  }
}
