import { Controller, Get, Post, Body, Param, Res, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ApiResponse } from '../../shared/base/base.response';
import { Invoice } from './schemas/invoice.schema';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  async findAll(): Promise<ApiResponse<Invoice[]>> {
    const invoices = await this.invoiceService.findAll();
    return ApiResponse.success(invoices);
  }

  @Get(':id')
  async findOne(@Param('id') id: ObjectId): Promise<ApiResponse<Invoice | null>> {
    const invoice = await this.invoiceService.findOne(id);
    return ApiResponse.success(invoice);
  }

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<ApiResponse<Invoice>> {
    const invoice = await this.invoiceService.createInvoice(createInvoiceDto);
    return ApiResponse.success(invoice);
  }

  @Post(':id/print')
  async printInvoice(@Param('id') id: ObjectId, @Res() res: Response): Promise<void> {
    const invoice = await this.invoiceService.findOne(id);
    // In a real application, you would generate a PDF here.
    // For this example, we will just return the invoice as JSON.
    res.json(ApiResponse.success(invoice, 'Invoice printed successfully'));
  }
}