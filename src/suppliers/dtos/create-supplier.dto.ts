import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { StatusEnum } from '../supplier.entity';

const dateFormatRegex = /^\d{2}-\d{2}-\d{4}$/;

export class CreateSupplierDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  suppliers: string;

  @IsString()
  @Matches(dateFormatRegex, {
    message: 'Date must be in the format "dd-mm-yyyy"',
  })
  date: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsOptional()
  @IsEnum(StatusEnum)
  status: string;
}
