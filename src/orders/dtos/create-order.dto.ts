import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { OrderStatusEnum } from '../order.entity';
import { dateFormatRegex } from 'src/suppliers/dtos/create-supplier.dto';

export class CreateOrderDto {
  @IsString()
  customerName: string;

  @IsString()
  address: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;

  @IsString()
  @Matches(dateFormatRegex, {
    message: 'Date must be in the format "dd-mm-yyyy"',
  })
  date: string;
}
