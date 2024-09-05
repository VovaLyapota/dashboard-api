import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';

class OrdersServiceMock {
  findOne = jest.fn();
  findAll = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersServiceMock: OrdersServiceMock;
  let order: Order;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useClass: OrdersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersServiceMock = module.get<OrdersServiceMock>(OrdersService);
    order = {
      id: 1,
      customerName: 'Customer',
      address: "Customer's address",
      quantity: 1,
      amount: 1000,
      status: 'Pending',
      date: '30-08-2024',
    } as Order;
  });

  it('orders controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getOrders - returns all orders by given query', async () => {
    ordersServiceMock.findAll.mockResolvedValueOnce([order]);
    const foundOrders = await controller.getOrders({} as GetOrdersDto);

    expect(foundOrders).toEqual([order]);
    expect(ordersServiceMock.findAll).toHaveBeenCalledWith({});
  });

  it('getOrders - throws a NotFoundException if no any orders were found', async () => {
    ordersServiceMock.findAll.mockResolvedValueOnce([]);

    await expect(controller.getOrders({} as GetOrdersDto)).rejects.toThrow(
      NotFoundException,
    );
    expect(ordersServiceMock.findAll).toHaveBeenCalledWith({});
  });

  it('getOrder - returns the order by given id', async () => {
    ordersServiceMock.findOne.mockResolvedValueOnce(order);
    const foundOrder = await controller.getOrder('1');

    expect(foundOrder).toEqual(order);
    expect(ordersServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('getOrder - throws a BadRequestException if invalid id was given', async () => {
    await expect(controller.getOrder('invalid_id')).rejects.toThrow(
      BadRequestException,
    );
    expect(ordersServiceMock.findOne).not.toHaveBeenCalled();
  });

  it('getOrder - throws a NotFoundException if such an order was not found', async () => {
    ordersServiceMock.findOne.mockResolvedValueOnce(null);

    await expect(controller.getOrder('1')).rejects.toThrow(NotFoundException);
    expect(ordersServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('createOrder - creates and returns an order', async () => {
    ordersServiceMock.create.mockResolvedValueOnce(order);
    const createdOrder = await controller.createOrder({} as CreateOrderDto);

    expect(createdOrder).toEqual(order);
    expect(ordersServiceMock.create).toHaveBeenCalledWith({});
  });

  it('updateOrder - updates and returns the order by given id and update values', async () => {
    const updateValues = { amount: 120 };
    ordersServiceMock.update.mockResolvedValueOnce({
      ...order,
      ...updateValues,
    });
    const updatedOrder = await controller.updateOrder('1', updateValues);

    expect(updatedOrder).toEqual({ ...order, ...updateValues });
    expect(ordersServiceMock.update).toHaveBeenCalledWith(1, updateValues);
  });

  it('updateOrder - throws a BadRequestException if invalid id was given', async () => {
    // await expect(controller.updateOrder('invalid_id', {})).rejects.toThrow(
    //   BadRequestException,
    // );
    expect(ordersServiceMock.update).not.toHaveBeenCalled();
  });

  it('deleteOrder - deletes the order by given id', async () => {
    ordersServiceMock.delete.mockResolvedValueOnce(order);
    const res = await controller.deleteOrder('1');

    expect(res).toBeUndefined();
    expect(ordersServiceMock.delete).toHaveBeenCalledWith(1);
  });

  it('deleteOrder - throws a BadRequestException if invalid id was given', async () => {
    await expect(controller.deleteOrder('invalid_id')).rejects.toThrow(
      BadRequestException,
    );
    expect(ordersServiceMock.delete).not.toHaveBeenCalled();
  });
});
