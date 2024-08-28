import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { OrderStatusEnum } from '../order.entity';

export class GetOrdersDto {
  @IsOptional()
  @IsString()
  customer: string;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  quantity: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  minAmount: number;

  @IsOptional()
  @Transform(({ value }) => +value)
  @IsNumber()
  maxAmount: number;

  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status: OrderStatusEnum;
}
