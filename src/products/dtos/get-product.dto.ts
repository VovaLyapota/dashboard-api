import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CategoryEnum } from '../product.entity';

export class GetProductsDto {
  @IsOptional()
  @IsNumber()
  stock: number;

  @IsOptional()
  @IsNumber()
  minPrice: string;

  @IsOptional()
  @IsNumber()
  maxPrice: string;

  @IsOptional()
  @IsEnum(CategoryEnum)
  category: string;

  @IsOptional()
  @IsString()
  supplier: string;
}
