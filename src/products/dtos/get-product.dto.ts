import { IsEnum, IsNumber, IsString } from 'class-validator';
import { CategoryEnum } from '../product.entity';

export class GetProductsDto {
  @IsNumber()
  stock: number;

  @IsNumber()
  minPrice: string;

  @IsNumber()
  maxPrice: string;

  @IsEnum(CategoryEnum)
  category: string;

  @IsString()
  supplier: string;
}
