import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ApiResponse } from '../../shared/base/base.response';
import { Customer } from './customer.entity';
import { ObjectId } from 'mongodb';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  const mockCustomerService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const customers: Customer[] = [{ id: new ObjectId(), customerCode: 'C001', fullName: 'Customer 1', phone: '123', email: 'c1@example.com', address: 'Address 1', createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(customers);
      expect(await controller.findAll()).toEqual(ApiResponse.success(customers));
    });
  });

  describe('findOne', () => {
    it('should return a single customer', async () => {
      const customerId = new ObjectId();
      const customer: Customer = { id: customerId, customerCode: 'C001', fullName: 'Customer 1', phone: '123', email: 'c1@example.com', address: 'Address 1', createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(service, 'findOne').mockResolvedValue(customer);
      expect(await controller.findOne(customerId)).toEqual(ApiResponse.success(customer));
    });
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const createCustomerDto: CreateCustomerDto = { customerCode: 'C001', fullName: 'Customer 1', phone: '123', email: 'c1@example.com', address: 'Address 1' };
      const customer: Customer = { id: new ObjectId(), ...createCustomerDto, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(service, 'create').mockResolvedValue(customer);
      expect(await controller.create(createCustomerDto)).toEqual(ApiResponse.success(customer));
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const customerId = new ObjectId();
      const updateCustomerDto: CreateCustomerDto = { customerCode: 'C001', fullName: 'Updated Customer', phone: '123', email: 'c1@example.com', address: 'Address 1' };
      const customer: Customer = { id: customerId, customerCode: 'C001', fullName: 'Updated Customer', phone: '123', email: 'c1@example.com', address: 'Address 1', createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(service, 'update').mockResolvedValue(customer);
      expect(await controller.update(customerId, updateCustomerDto)).toEqual(ApiResponse.success(customer));
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      const customerId = new ObjectId();
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      expect(await controller.remove(customerId)).toEqual(ApiResponse.success(null));
    });
  });
});
