import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BaseService } from '../../shared/base/base.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class CustomerService extends BaseService<CustomerDocument> {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
  ) {
    super(customerModel);
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerDocument> {
    return super.create(createCustomerDto);
  }

  async update(id: ObjectId, updateCustomerDto: UpdateCustomerDto): Promise<CustomerDocument | null> {
    return super.update(id, updateCustomerDto);
  }
}