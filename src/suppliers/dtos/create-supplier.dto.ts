import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { SupplierStatusEnum } from '../supplier.entity';

export const dateFormatRegex = /^\d{2}-\d{2}-\d{4}$/;

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  company: string;

  @IsString()
  @Matches(dateFormatRegex, {
    message: 'Date must be in the format "dd-mm-yyyy"',
  })
  date: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsEnum(SupplierStatusEnum)
  status: string;
}
