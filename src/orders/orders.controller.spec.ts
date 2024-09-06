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
    order = { id: 1, customerName: 'customer' } as Order;
  });

  it('orders controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOrders', () => {
    it('should return all orders by given getDto', async () => {
      ordersServiceMock.findAll.mockResolvedValueOnce([order]);
      const foundOrders = await controller.getOrders({} as GetOrdersDto);

      expect(foundOrders).toEqual([order]);
      expect(ordersServiceMock.findAll).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if no orders were found', async () => {
      ordersServiceMock.findAll.mockResolvedValueOnce([]);

      await expect(controller.getOrders({} as GetOrdersDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(ordersServiceMock.findAll).toHaveBeenCalled();
    });
  });

  describe('getOrder', () => {
    it('should return the order by given id', async () => {
      ordersServiceMock.findOne.mockResolvedValueOnce(order);
      const foundOrder = await controller.getOrder('1');

      expect(foundOrder).toEqual(order);
      expect(ordersServiceMock.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw a BadRequestException if invalid id was given', async () => {
      await expect(controller.getOrder('invalid_id')).rejects.toThrow(
        BadRequestException,
      );
      expect(ordersServiceMock.findOne).not.toHaveBeenCalled();
    });

    it('should throw a NotFoundException if an order was not found', async () => {
      ordersServiceMock.findOne.mockResolvedValueOnce(null);

      await expect(controller.getOrder('1')).rejects.toThrow(NotFoundException);
      expect(ordersServiceMock.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('createOrder', () => {
    it('should create and return an order by given createDto', async () => {
      ordersServiceMock.create.mockResolvedValueOnce(order);
      const createdOrder = await controller.createOrder({} as CreateOrderDto);

      expect(createdOrder).toEqual(order);
      expect(ordersServiceMock.create).toHaveBeenCalled();
    });
  });

  describe('updateOrder', () => {
    it('should update and return the order by given id and updateDto', async () => {
      const updateDto = { customerName: 'New customer' };
      const updateRes = { ...order, ...updateDto };
      ordersServiceMock.update.mockResolvedValueOnce(updateRes);
      const updatedOrder = await controller.updateOrder('1', updateDto);

      expect(updatedOrder).toEqual(updateRes);
      expect(ordersServiceMock.update).toHaveBeenCalledWith(1, updateDto);
    });

    // it('should throw a BadRequestException if invalid id was given', async () => {
    //   await expect(controller.updateOrder('invalid_id', {})).rejects.toThrow(
    //     BadRequestException,
    //   );
    //   expect(ordersServiceMock.update).not.toHaveBeenCalled();
    // });
  });

  describe('deleteOrder', () => {
    it('should delete the order by given id', async () => {
      ordersServiceMock.delete.mockResolvedValueOnce(order);
      const res = await controller.deleteOrder('1');

      expect(res).toBeUndefined();
      expect(ordersServiceMock.delete).toHaveBeenCalledWith(1);
    });

    it('should throw a BadRequestException if invalid id was given', async () => {
      await expect(controller.deleteOrder('invalid_id')).rejects.toThrow(
        BadRequestException,
      );
      expect(ordersServiceMock.delete).not.toHaveBeenCalled();
    });
  });
});
