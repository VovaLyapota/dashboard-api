import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CategoryEnum } from '../product.entity';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  photo: string | null;

  @IsString()
  @MinLength(1)
  @MaxLength(140)
  name: string;

  @IsNumber()
  @Min(1)
  stock: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsEnum(CategoryEnum)
  category: CategoryEnum;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  suppliers: number[];
}
