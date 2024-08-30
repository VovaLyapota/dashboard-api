import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CategoryEnum } from '../product.entity';

export class GetProductsDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  stock: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  minPrice: string;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  maxPrice: string;

  @IsOptional()
  @IsEnum(CategoryEnum)
  category: string;
}
