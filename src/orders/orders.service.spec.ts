import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order, OrderStatusEnum } from './order.entity';
import { OrdersService } from './orders.service';

class OrdersRepoMok {
  findOneBy = jest.fn();
  create = jest.fn();
  save = jest.fn();
  remove = jest.fn();
  createQueryBuilder = jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  });
}

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepoMock: OrdersRepoMok;
  let order: Order;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useClass: OrdersRepoMok,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepoMock = module.get<OrdersRepoMok>(getRepositoryToken(Order));
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

  it('orders service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne - returns an order by given id', async () => {
    ordersRepoMock.findOneBy.mockResolvedValueOnce(order);
    const foundOrder = await service.findOne(1);

    expect(foundOrder).toEqual(order);
    expect(ordersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('findAll - returns all the orders by given options', async () => {
    const getOrdersDto = {
      customer: 'Customer',
      quantity: 1,
      minAmount: 1,
      maxAmount: 1000,
      status: OrderStatusEnum.PENDING,
    };
    ordersRepoMock.createQueryBuilder().getMany.mockResolvedValueOnce([order]);

    const foundOrders = await service.findAll(getOrdersDto);

    expect(foundOrders).toEqual([order]);
    expect(ordersRepoMock.createQueryBuilder).toHaveBeenCalled();
  });

  it('create - creates and returns an order by given dto', async () => {
    const createOrderDto = {
      customerName: 'New Customer',
      address: "New Customer's address",
      quantity: 3,
      amount: 100,
      status: OrderStatusEnum.PENDING,
      date: '30-08-2024',
    };
    ordersRepoMock.create.mockReturnValue(order);
    ordersRepoMock.save.mockResolvedValueOnce(order);

    const createdOrder = await service.create(createOrderDto);

    expect(createdOrder).toEqual(order);
    expect(ordersRepoMock.create).toHaveBeenCalledWith(createOrderDto);
    expect(ordersRepoMock.save).toHaveBeenCalledWith(order);
  });

  it('update - updates and returns the order by given id and update values', async () => {
    const updateOrderDto = {
      quantity: 2,
    };
    ordersRepoMock.findOneBy.mockResolvedValueOnce(order);
    ordersRepoMock.save.mockResolvedValueOnce({ ...order, ...updateOrderDto });

    const updatedOrder = await service.update(1, updateOrderDto);

    expect(updatedOrder).toEqual({ ...order, ...updateOrderDto });
    expect(ordersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(ordersRepoMock.save).toHaveBeenCalledWith({
      ...order,
      ...updateOrderDto,
    });
  });

  it('update - throws a NotFoundException if no orders with given id were found', async () => {
    ordersRepoMock.findOneBy.mockResolvedValueOnce(null);

    await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    expect(ordersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(ordersRepoMock.save).not.toHaveBeenCalled();
  });

  it('delete - removes the order by given id', async () => {
    ordersRepoMock.findOneBy.mockResolvedValueOnce(order);
    ordersRepoMock.remove.mockResolvedValueOnce(order);

    const deletedOrder = await service.delete(1);

    expect(deletedOrder).toEqual(order);
    expect(ordersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(ordersRepoMock.remove).toHaveBeenCalledWith(order);
  });

  it('delete - throws a BadRequestException if invalid id was given', async () => {
    ordersRepoMock.findOneBy.mockResolvedValueOnce(null);

    await expect(service.delete(1)).rejects.toThrow(BadRequestException);
    expect(ordersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(ordersRepoMock.remove).not.toHaveBeenCalled();
  });
});
