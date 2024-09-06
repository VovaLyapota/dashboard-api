import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order, OrderStatusEnum } from './order.entity';
import { OrdersService } from './orders.service';
import { GetOrdersDto } from './dtos/get-orders.dto';
import { CreateOrderDto } from './dtos/create-order.dto';

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
    order = { id: 1, customerName: 'customer' } as Order;
  });

  it('orders service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return an order by given id', async () => {
      ordersRepoMock.findOneBy.mockResolvedValueOnce(order);
      const foundOrder = await service.findOne(1);

      expect(foundOrder).toEqual(order);
      expect(ordersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('findAll', () => {
    it('should return all orders by given getDto', async () => {
      ordersRepoMock
        .createQueryBuilder()
        .getMany.mockResolvedValueOnce([order]);
      const foundOrders = await service.findAll({} as GetOrdersDto);

      expect(foundOrders).toEqual([order]);
      expect(ordersRepoMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return an order by given dto', async () => {
      ordersRepoMock.create.mockReturnValue(order);
      ordersRepoMock.save.mockResolvedValueOnce(order);
      const createdOrder = await service.create({} as CreateOrderDto);

      expect(createdOrder).toEqual(order);
      expect(ordersRepoMock.create).toHaveBeenCalled();
      expect(ordersRepoMock.save).toHaveBeenCalledWith(order);
    });
  });

  describe('update', () => {
    it('should update and return the order by given id and updateDto', async () => {
      const updateDto = { customerName: 'New customer' };
      const updateRes = { ...order, ...updateDto };
      ordersRepoMock.findOneBy.mockResolvedValueOnce(order);
      ordersRepoMock.save.mockResolvedValueOnce(updateRes);
      const updatedOrder = await service.update(1, updateDto);

      expect(updatedOrder).toEqual(updateRes);
      expect(ordersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(ordersRepoMock.save).toHaveBeenCalledWith(updateRes);
    });

    it('should throw a NotFoundException if no order with given id was found', async () => {
      ordersRepoMock.findOneBy.mockResolvedValueOnce(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
      expect(ordersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(ordersRepoMock.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should remove the order by given id', async () => {
      ordersRepoMock.findOneBy.mockResolvedValueOnce(order);
      ordersRepoMock.remove.mockResolvedValueOnce(order);
      const deletedOrder = await service.delete(1);

      expect(deletedOrder).toEqual(order);
      expect(ordersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(ordersRepoMock.remove).toHaveBeenCalledWith(order);
    });

    it('should throw a BadRequestException if invalid id was given', async () => {
      ordersRepoMock.findOneBy.mockResolvedValueOnce(null);

      await expect(service.delete(1)).rejects.toThrow(BadRequestException);
      expect(ordersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(ordersRepoMock.remove).not.toHaveBeenCalled();
    });
  });
});
