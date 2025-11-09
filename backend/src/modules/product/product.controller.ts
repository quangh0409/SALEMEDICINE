import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiResponse } from '../../shared/base/base.response';
import { Product } from './schemas/product.schema';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<ApiResponse<Product[]>> {
    const products = await this.productService.findAll();
    return ApiResponse.success(products);
  }

  @Get(':id')
  async findOne(@Param('id') id: ObjectId): Promise<ApiResponse<Product | null>> {
    const product = await this.productService.findOne(id);
    return ApiResponse.success(product);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<ApiResponse<Product>> {
    const product = await this.productService.create(createProductDto);
    return ApiResponse.success(product);
  }

  @Put(':id')
  async update(@Param('id') id: ObjectId, @Body() updateProductDto: UpdateProductDto): Promise<ApiResponse<Product | null>> {
    const product = await this.productService.update(id, updateProductDto);
    return ApiResponse.success(product);
  }

  @Delete(':id')
  async remove(@Param('id') id: ObjectId): Promise<ApiResponse<null>> {
    await this.productService.remove(id);
    return ApiResponse.success(null);
  }
}