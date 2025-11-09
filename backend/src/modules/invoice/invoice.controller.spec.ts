import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ApiResponse } from '../../shared/base/base.response';
import { Invoice } from './invoice.entity';
import { ObjectId } from 'mongodb';
import { Response } from 'express';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let service: InvoiceService;

  const mockInvoiceService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    createInvoice: jest.fn(),
    printInvoice: jest.fn(), // Added
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
    service = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const invoices: Invoice[] = [];
      jest.spyOn(service, 'findAll').mockResolvedValue(invoices);
      expect(await controller.findAll()).toEqual(ApiResponse.success(invoices));
    });
  });

  describe('findOne', () => {
    it('should return a single invoice', async () => {
      const invoiceId = new ObjectId();
      const invoice: Invoice = { id: invoiceId, invoiceCode: 'INV001', customer: {} as any, items: [], total: 100, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(service, 'findOne').mockResolvedValue(invoice);
      expect(await controller.findOne(invoiceId)).toEqual(ApiResponse.success(invoice));
    });
  });

  describe('create', () => {
    it('should create a new invoice', async () => {
      const createInvoiceDto: CreateInvoiceDto = { invoiceCode: 'INV001', customerId: new ObjectId().toHexString(), items: [] };
      const invoice: Invoice = { id: new ObjectId(), invoiceCode: 'INV001', customer: {} as any, items: [], total: 0, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(service, 'createInvoice').mockResolvedValue(invoice);
      expect(await controller.create(createInvoiceDto)).toEqual(ApiResponse.success(invoice));
    });
  });

  describe('printInvoice', () => {
    it('should return the invoice as JSON', async () => {
      const invoiceId = new ObjectId();
      const invoice: Invoice = { id: invoiceId, invoiceCode: 'INV001', customer: {} as any, items: [], total: 100, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(service, 'findOne').mockResolvedValue(invoice);

      const mockResponse = {
        json: jest.fn(),
      } as unknown as Response;

      await controller.printInvoice(invoiceId, mockResponse);
      expect(mockResponse.json).toHaveBeenCalledWith(ApiResponse.success(invoice, 'Invoice printed successfully'));
    });
  });
});
