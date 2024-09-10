import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async getOrders(@Query() query: GetOrdersDto) {
    const orders = await this.ordersService.findAll(query);
    if (!orders.length) throw new NotFoundException('There are no any orders.');

    return orders;
  }

  @Get('/:id')
  async getOrder(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('Invalid id property');

    const order = await this.ordersService.findOne(+id);
    if (!order)
      throw new NotFoundException("Order with such an id doesn't exist");

    return order;
  }

  @Post()
  createOrder(@Body() body: CreateOrderDto) {
    return this.ordersService.create(body);
  }

  @Put('/:id')
  updateOrder(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    if (!+id) throw new BadRequestException('Invalid id property');

    return this.ordersService.update(+id, body);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrder(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('Invalid id property');

    await this.ordersService.delete(+id);
  }
}
