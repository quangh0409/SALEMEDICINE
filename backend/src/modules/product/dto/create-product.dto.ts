
import { IsString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  unit: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  warningThreshold?: number;
}
