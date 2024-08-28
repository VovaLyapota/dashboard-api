import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CategoryEnum } from '../product.entity';
import { Transform } from 'class-transformer';

export class GetProductsDto {
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  stock: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  minPrice: string;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  maxPrice: string;

  @IsOptional()
  @IsEnum(CategoryEnum)
  category: string;

  @IsOptional()
  @IsString()
  supplier: string;
}
