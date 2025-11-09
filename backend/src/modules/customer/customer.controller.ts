import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ApiResponse } from '../../shared/base/base.response';
import { Customer } from './schemas/customer.schema';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll(): Promise<ApiResponse<Customer[]>> {
    const customers = await this.customerService.findAll();
    return ApiResponse.success(customers);
  }

  @Get(':id')
  async findOne(@Param('id') id: ObjectId): Promise<ApiResponse<Customer | null>> {
    const customer = await this.customerService.findOne(id);
    return ApiResponse.success(customer);
  }

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto): Promise<ApiResponse<Customer>> {
    const customer = await this.customerService.create(createCustomerDto);
    return ApiResponse.success(customer);
  }

  @Put(':id')
  async update(@Param('id') id: ObjectId, @Body() updateCustomerDto: CreateCustomerDto): Promise<ApiResponse<Customer | null>> {
    const customer = await this.customerService.update(id, updateCustomerDto);
    return ApiResponse.success(customer);
  }

  @Delete(':id')
  async remove(@Param('id') id: ObjectId): Promise<ApiResponse<null>> {
    await this.customerService.remove(id);
    return ApiResponse.success(null);
  }
}