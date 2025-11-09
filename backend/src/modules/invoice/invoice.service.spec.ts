import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceItem } from './invoice-item.entity';
import { Product } from '../product/product.entity';
import { Customer } from '../customer/customer.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ObjectId } from 'mongodb';
import { ProductService } from '../product/product.service'; // Import ProductService
import { CustomerService } from '../customer/customer.service'; // Import CustomerService

describe('InvoiceService', () => {
  let service: InvoiceService;
  let invoiceRepository: Repository<Invoice>;
  let productRepository: Repository<Product>;
  let customerRepository: Repository<Customer>;

  const mockInvoiceRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProductRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockCustomerRepository = {
    findOne: jest.fn(),
  };

  const mockProductService = { // Mock ProductService
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockCustomerService = { // Mock CustomerService
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: mockInvoiceRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: getRepositoryToken(Customer),
          useValue: mockCustomerRepository,
        },
        { // Provide mock ProductService
          provide: ProductService,
          useValue: mockProductService,
        },
        { // Provide mock CustomerService
          provide: CustomerService,
          useValue: mockCustomerService,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    invoiceRepository = module.get<Repository<Invoice>>(getRepositoryToken(Invoice));
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    customerRepository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const result: Invoice[] = [];
      jest.spyOn(invoiceRepository, 'find').mockResolvedValue(result);
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single invoice', async () => {
      const invoiceId = new ObjectId();
      const result: Invoice = { id: invoiceId, invoiceCode: 'INV001', customer: {} as Customer, items: [], total: 100, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(invoiceRepository, 'findOne').mockResolvedValue(result);
      expect(await service.findOne(invoiceId)).toBe(result);
    });
  });

  describe('createInvoice', () => {
    it('should create a new invoice and update product stock', async () => {
      const customerId = new ObjectId();
      const productId = new ObjectId();
      const createInvoiceDto: CreateInvoiceDto = {
        invoiceCode: 'INV001',
        customerId: customerId.toHexString(),
        items: [{ productId: productId.toHexString(), quantity: 2 }],
      };

      const mockCustomer: Customer = { id: customerId, customerCode: 'C001', fullName: 'Test Customer', phone: '123456789', email: 'test@example.com', address: '123 Test St', createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      const mockProduct: Product = { id: productId, code: 'P001', name: 'Test Product', price: 50, unit: 'pcs', stock: 10, warningThreshold: 5, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };

      jest.spyOn(mockCustomerService, 'findOne').mockResolvedValue(mockCustomer);
      jest.spyOn(mockProductService, 'findOne').mockResolvedValue(mockProduct);
      jest.spyOn(mockProductService, 'save').mockImplementation(async (product) => product); // Simplified

      const mockInvoiceItem = { product: mockProduct, quantity: 2, price: 100 } as InvoiceItem;

      const mockInvoice = {
        id: new ObjectId(),
        invoiceCode: 'INV001',
        customer: mockCustomer,
        items: [mockInvoiceItem],
        total: 100,
        createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test'
      };
      jest.spyOn(invoiceRepository, 'create').mockReturnValue(mockInvoice);
      jest.spyOn(invoiceRepository, 'save').mockResolvedValue(mockInvoice);

      const result = await service.createInvoice(createInvoiceDto);

      expect(result).toBe(mockInvoice);
      expect(mockCustomerService.findOne).toHaveBeenCalledWith(customerId);
      expect(mockProductService.findOne).toHaveBeenCalledWith(productId);
      expect(mockProductService.save).toHaveBeenCalledWith(expect.objectContaining({ stock: 8 })); // 10 - 2
      expect(invoiceRepository.save).toHaveBeenCalledWith(expect.objectContaining({ total: 100 }));
    });

    it('should throw an error if customer not found', async () => {
      const customerId = new ObjectId();
      const productId = new ObjectId();
      const createInvoiceDto: CreateInvoiceDto = {
        invoiceCode: 'INV001',
        customerId: customerId.toHexString(),
        items: [{ productId: productId.toHexString(), quantity: 2 }],
      };
      jest.spyOn(mockCustomerService, 'findOne').mockResolvedValue(null);

      await expect(service.createInvoice(createInvoiceDto)).rejects.toThrow('Customer not found');
    });

    it('should throw an error if product not found', async () => {
      const customerId = new ObjectId();
      const productId = new ObjectId();
      const createInvoiceDto: CreateInvoiceDto = {
        invoiceCode: 'INV001',
        customerId: customerId.toHexString(),
        items: [{ productId: productId.toHexString(), quantity: 2 }],
      };
      const mockCustomer: Customer = { id: customerId, customerCode: 'C001', fullName: 'Test Customer', phone: '123456789', email: 'test@example.com', address: '123 Test St', createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };

      jest.spyOn(mockCustomerService, 'findOne').mockResolvedValue(mockCustomer);
      jest.spyOn(mockProductService, 'findOne').mockResolvedValue(null);

      await expect(service.createInvoice(createInvoiceDto)).rejects.toThrow(`Product with id ${productId.toHexString()} not found`);
    });

    it('should throw an error if product stock is insufficient', async () => {
      const customerId = new ObjectId();
      const productId = new ObjectId();
      const createInvoiceDto: CreateInvoiceDto = {
        invoiceCode: 'INV001',
        customerId: customerId.toHexString(),
        items: [{ productId: productId.toHexString(), quantity: 20 }],
      };
      const mockCustomer: Customer = { id: customerId, customerCode: 'C001', fullName: 'Test Customer', phone: '123456789', email: 'test@example.com', address: '123 Test St', createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      const mockProduct: Product = { id: productId, code: 'P001', name: 'Test Product', price: 50, unit: 'pcs', stock: 10, warningThreshold: 5, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };

      jest.spyOn(mockCustomerService, 'findOne').mockResolvedValue(mockCustomer);
      jest.spyOn(mockProductService, 'findOne').mockResolvedValue(mockProduct);

      await expect(service.createInvoice(createInvoiceDto)).rejects.toThrow(`Not enough stock for product ${mockProduct.name}`);
    });
  });
});
