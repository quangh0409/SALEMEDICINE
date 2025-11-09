import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ProductService } from '../product/product.service';
import { CustomerService } from '../customer/customer.service';
import { BaseService } from '../../shared/base/base.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class InvoiceService extends BaseService<InvoiceDocument> {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<InvoiceDocument>,
    private readonly productService: ProductService,
    private readonly customerService: CustomerService,
  ) {
    super(invoiceModel);
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<InvoiceDocument> {
    const customer = await this.customerService.findOne(new ObjectId(createInvoiceDto.customerId));
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    let total = 0;
    const invoiceItems: any[] = [];

    for (const itemDto of createInvoiceDto.items) {
      const product = await this.productService.findOne(new ObjectId(itemDto.productId));
      if (!product) {
        throw new NotFoundException(`Product with id ${itemDto.productId} not found`);
      }
      if (product.stock < itemDto.quantity) {
        throw new BadRequestException(`Not enough stock for product ${product.name}`);
      }

      // Update product stock
      await this.productService.update(new ObjectId(itemDto.productId), { stock: product.stock - itemDto.quantity });

      invoiceItems.push({
        product: product._id, // Store product ObjectId reference
        quantity: itemDto.quantity,
        price: product.price,
      });
      total += product.price * itemDto.quantity;
    }

    const createdInvoice = new this.invoiceModel({
      invoiceCode: createInvoiceDto.invoiceCode,
      customer: customer._id, // Store customer ObjectId reference
      items: invoiceItems,
      total,
    });

    return createdInvoice.save();
  }

  async update(id: ObjectId, updateInvoiceDto: UpdateInvoiceDto): Promise<InvoiceDocument | null> {
    return super.update(id, updateInvoiceDto);
  }
}