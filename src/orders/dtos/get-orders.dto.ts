import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderStatusEnum } from '../order.entity';

export class GetOrdersDto {
  @IsOptional()
  @IsString()
  customer: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  quantity: number;

  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  @IsNumber()
  minAmount: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  maxAmount: number;

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;
}
