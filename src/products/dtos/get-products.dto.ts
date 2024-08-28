import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CategoryEnum } from '../product.entity';

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
}
