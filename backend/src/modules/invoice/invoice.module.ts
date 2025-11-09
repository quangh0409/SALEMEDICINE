import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { ProductModule } from '../product/product.module';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    ProductModule,
    CustomerModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}