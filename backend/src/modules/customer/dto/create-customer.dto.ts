import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  customerCode: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  address: string;
}