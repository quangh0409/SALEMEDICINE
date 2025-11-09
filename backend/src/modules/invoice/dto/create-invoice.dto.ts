import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  invoiceCode: string;

  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];
}