import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiResponse } from '../../shared/base/base.response';
import { Product } from './product.entity';
import { ObjectId } from 'mongodb';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    importProducts: jest.fn(),
    exportProducts: jest.fn(),
    findProductsBelowWarningThreshold: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products: Product[] = [{ id: new ObjectId(), code: 'P001', name: 'Product 1', price: 10, unit: 'pcs', stock: 100, warningThreshold: 10, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(products);
      expect(await controller.findAll()).toEqual(ApiResponse.success(products));
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const productId = new ObjectId();
      const product: Product = { id: productId, code: 'P001', name: 'Product 1', price: 10, unit: 'pcs', stock: 100, warningThreshold: 10, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(service, 'findOne').mockResolvedValue(product);
      expect(await controller.findOne(productId)).toEqual(ApiResponse.success(product));
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = { code: 'P001', name: 'Product 1', price: 10, unit: 'pcs', stock: 100, warningThreshold: 10 };
      const product: Product = { id: new ObjectId(), ...createProductDto, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(service, 'create').mockResolvedValue(product);
      expect(await controller.create(createProductDto)).toEqual(ApiResponse.success(product));
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = new ObjectId();
      const updateProductDto: CreateProductDto = { code: 'P001', name: 'Updated Product', price: 12, unit: 'pcs', stock: 100, warningThreshold: 10 };
      const product: Product = { id: productId, code: 'P001', name: 'Updated Product', price: 12, unit: 'pcs', stock: 100, warningThreshold: 10, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(service, 'update').mockResolvedValue(product);
      expect(await controller.update(productId, updateProductDto)).toEqual(ApiResponse.success(product));
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const productId = new ObjectId();
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
      expect(await controller.remove(productId)).toEqual(ApiResponse.success(null));
    });
  });

  describe('import', () => {
    it('should import products', async () => {
      const createProductDtos: CreateProductDto[] = [{ code: 'P001', name: 'Product 1', price: 10, unit: 'pcs', stock: 50, warningThreshold: 10 }];
      const products: Product[] = [{ id: new ObjectId(), code: 'P001', name: 'Product 1', price: 10, unit: 'pcs', stock: 150, warningThreshold: 10, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' }];
      jest.spyOn(service, 'importProducts').mockResolvedValue(products);
      expect(await controller.import(createProductDtos)).toEqual(ApiResponse.success(products));
    });
  });

  describe('export', () => {
    it('should export products', async () => {
      const productExports = [{ code: 'P001', quantity: 20 }];
      const products: Product[] = [{ id: new ObjectId(), code: 'P001', name: 'Product 1', price: 10, unit: 'pcs', stock: 80, warningThreshold: 10, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' }];
      jest.spyOn(service, 'exportProducts').mockResolvedValue(products);
      expect(await controller.export(productExports)).toEqual(ApiResponse.success(products));
    });
  });

  describe('findLowStock', () => {
    it('should return products below warning threshold', async () => {
      const products: Product[] = [{ id: new ObjectId(), code: 'P004', name: 'Product 4', price: 5, unit: 'pcs', stock: 5, warningThreshold: 10, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' }];
      jest.spyOn(service, 'findProductsBelowWarningThreshold').mockResolvedValue(products);
      expect(await controller.findLowStock()).toEqual(ApiResponse.success(products));
    });
  });
});
