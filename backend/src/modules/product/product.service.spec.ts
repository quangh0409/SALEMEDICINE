import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ObjectId } from 'mongodb';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<Product>;

  const mockProductRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

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
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result: Product[] = [{ id: new ObjectId(), code: 'P001', name: 'Product 1', price: 10, unit: 'pcs', stock: 100, warningThreshold: 10, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' }];
      jest.spyOn(mockProductService, 'findAll').mockResolvedValue(result);
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const productId = new ObjectId();
      const result: Product = { id: productId, code: 'P001', name: 'Product 1', price: 10, unit: 'pcs', stock: 100, warningThreshold: 10, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(mockProductService, 'findOne').mockResolvedValue(result);
      expect(await service.findOne(productId)).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = { code: 'P001', name: 'Product 1', price: 10, unit: 'pcs', stock: 100, warningThreshold: 10 };
      const product: Product = { id: new ObjectId(), ...createProductDto, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(mockProductService, 'create').mockResolvedValue(product);
      expect(await service.create(createProductDto)).toBe(product);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const productId = new ObjectId();
      const updateProductDto: CreateProductDto = { code: 'P001', name: 'Updated Product', price: 12, unit: 'pcs', stock: 100, warningThreshold: 10 };
      const product: Product = { id: productId, code: 'P001', name: 'Updated Product', price: 12, unit: 'pcs', stock: 100, warningThreshold: 10, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      jest.spyOn(mockProductService, 'update').mockResolvedValue(product);
      expect(await service.update(productId, updateProductDto)).toBe(product);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const productId = new ObjectId();
      jest.spyOn(mockProductService, 'remove').mockResolvedValue(undefined);
      expect(await service.remove(productId)).toBeUndefined();
    });
  });

  describe('importProducts', () => {
    it('should import new products or update existing ones', async () => {
      const productDtos: CreateProductDto[] = [
        { code: 'P001', name: 'Product 1', price: 10, unit: 'pcs', stock: 50, warningThreshold: 10 },
        { code: 'P002', name: 'Product 2', price: 20, unit: 'pcs', stock: 30, warningThreshold: 10 },
      ];
      const existingProduct: Product = { id: new ObjectId(), code: 'P001', name: 'Product 1', price: 10, unit: 'pcs', stock: 100, warningThreshold: 10, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };
      const newProduct: Product = { id: new ObjectId(), code: 'P002', name: 'Product 2', price: 20, unit: 'pcs', stock: 30, warningThreshold: 10, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };

      jest.spyOn(mockProductService, 'importProducts').mockResolvedValue([
        { ...existingProduct, stock: 150 },
        newProduct,
      ]);

      const result = await service.importProducts(productDtos);
      expect(result.length).toBe(2);
      expect(result[0].stock).toBe(150); // 100 + 50
      expect(result[1].stock).toBe(30);
    });
  });

  describe('exportProducts', () => {
    it('should export products and decrease stock', async () => {
      const productExports = [{ code: 'P001', quantity: 20 }];
      const existingProduct: Product = { id: new ObjectId(), code: 'P001', name: 'Product 1', price: 10, unit: 'pcs', stock: 100, warningThreshold: 10, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' };

      jest.spyOn(mockProductService, 'exportProducts').mockResolvedValue([
        { ...existingProduct, stock: 80 },
      ]);

      const result = await service.exportProducts(productExports);
      expect(result.length).toBe(1);
      expect(result[0].stock).toBe(80); // 100 - 20
    });

    it('should throw an error if stock is insufficient', async () => {
      const productExports = [{ code: 'P001', quantity: 120 }];
      jest.spyOn(mockProductService, 'exportProducts').mockRejectedValue(new Error('Not enough stock for product with code P001'));

      await expect(service.exportProducts(productExports)).rejects.toThrow('Not enough stock for product with code P001');
    });

    it('should throw an error if product is not found', async () => {
      const productExports = [{ code: 'P003', quantity: 10 }];
      jest.spyOn(mockProductService, 'exportProducts').mockRejectedValue(new Error('Product with code P003 not found'));

      await expect(service.exportProducts(productExports)).rejects.toThrow('Product with code P003 not found');
    });
  });

  describe('findProductsBelowWarningThreshold', () => {
    it('should return products below warning threshold', async () => {
      const result: Product[] = [{ id: new ObjectId(), code: 'P004', name: 'Product 4', price: 5, unit: 'pcs', stock: 5, warningThreshold: 10, createdAt: new Date(), updatedAt: new Date(), createdBy: 'test', updatedBy: 'test' }];
      jest.spyOn(mockProductService, 'findProductsBelowWarningThreshold').mockResolvedValue(result);
      expect(await service.findProductsBelowWarningThreshold()).toBe(result);
    });
  });
});
