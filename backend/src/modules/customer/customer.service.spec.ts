import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ObjectId } from 'mongodb';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: Repository<Customer>;

  const mockCustomerRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const result: Customer[] = [{ id: new ObjectId(), customerCode: 'C001', fullName: 'Customer 1', phone: '123', email: 'c1@example.com', address: 'Address 1', createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' }];
      jest.spyOn(repository, 'find').mockResolvedValue(result);
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single customer', async () => {
      const customerId = new ObjectId();
      const result: Customer = { id: customerId, customerCode: 'C001', fullName: 'Customer 1', phone: '123', email: 'c1@example.com', address: 'Address 1', createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);
      expect(await service.findOne(customerId)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const createCustomerDto: CreateCustomerDto = { customerCode: 'C001', fullName: 'Customer 1', phone: '123', email: 'c1@example.com', address: 'Address 1' };
      const customer: Customer = { id: new ObjectId(), ...createCustomerDto, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(repository, 'create').mockReturnValue(customer);
      jest.spyOn(repository, 'save').mockResolvedValue(customer);
      expect(await service.create(createCustomerDto)).toBe(customer);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const customerId = new ObjectId();
      const updateCustomerDto: CreateCustomerDto = { customerCode: 'C001', fullName: 'Updated Customer', phone: '123', email: 'c1@example.com', address: 'Address 1' };
      const customer: Customer = { id: customerId, customerCode: 'C001', fullName: 'Updated Customer', phone: '123', email: 'c1@example.com', address: 'Address 1', createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findOne').mockResolvedValue(customer);
      expect(await service.update(customerId, updateCustomerDto)).toBe(customer);
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      const customerId = new ObjectId();
      jest.spyOn(repository, 'delete').mockResolvedValue(undefined);
      expect(await service.remove(customerId)).toBeUndefined();
    });
  });
});
