import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private ordersRepo: Repository<Order>) {}

  async findOne(id: number) {
    return await this.ordersRepo.findOneBy({ id });
  }

  async findAll(getOrdersDto: GetOrdersDto) {
    const { customer, quantity, minAmount, maxAmount, status } = getOrdersDto;
    const query = this.ordersRepo.createQueryBuilder('order');

    if (customer !== undefined)
      query.where('order.customerName LIKE :customer', {
        customer: `%${customer}%`,
      });
    if (quantity !== undefined)
      query.andWhere('order.quantity = :quantity', { quantity });
    if (minAmount !== undefined)
      query.andWhere('order.amount >= :minAmount', { minAmount });
    if (maxAmount !== undefined)
      query.andWhere('order.amount <= :maxAmount', { maxAmount });
    if (status !== undefined)
      query.andWhere('order.status = :status', { status });

    return await query.getMany();
  }

  async create(createOrderDto: CreateOrderDto) {
    const order = this.ordersRepo.create(createOrderDto);

    return await this.ordersRepo.save(order);
  }

  async update(id: number, updateValues: UpdateOrderDto) {
    const order = await this.findOne(id);
    if (!order)
      throw new NotFoundException('Order with such an id is not found.');

    Object.assign(order, updateValues);
    return await this.ordersRepo.save(order);
  }

  async delete(id: number) {
    const order = await this.findOne(id);
    if (!order)
      throw new NotFoundException('Order with such an id was not found');

    return await this.ordersRepo.remove(order);
  }
}
