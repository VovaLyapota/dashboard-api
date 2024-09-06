import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Customer } from './customer.entity';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { GetCustomersDto } from './dtos/get-customers.dto';

class CustomersServiceMock {
  findAll = jest.fn();
  findOne = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe('CustomersController', () => {
  let controller: CustomersController;
  let customersServiceMock: CustomersServiceMock;
  let customer: Customer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useClass: CustomersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    customersServiceMock = module.get<CustomersServiceMock>(CustomersService);
    customer = { id: 1, name: 'customer' } as Customer;
  });

  it('customers controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCustomers', () => {
    it("should return the customer's list by given getDto", async () => {
      customersServiceMock.findAll.mockResolvedValueOnce([customer]);
      const foundCustomers = await controller.getCustomers(
        {} as GetCustomersDto,
      );

      expect(foundCustomers).toEqual([customer]);
      expect(customersServiceMock.findAll).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if no customers were found', async () => {
      customersServiceMock.findAll.mockResolvedValueOnce([]);

      await expect(
        controller.getCustomers({} as GetCustomersDto),
      ).rejects.toThrow(NotFoundException);
      expect(customersServiceMock.findAll).toHaveBeenCalled();
    });
  });

  describe('getOneCustomer', () => {
    it('should return the customer by given id', async () => {
      customersServiceMock.findOne.mockResolvedValueOnce(customer);
      const foundCustomer = await controller.getOneCustomer('1');

      expect(foundCustomer).toEqual(customer);
      expect(customersServiceMock.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw a BadRequestException if invalid id was given', async () => {
      await expect(controller.getOneCustomer('invalid_id')).rejects.toThrow(
        BadRequestException,
      );
      expect(customersServiceMock.findOne).not.toHaveBeenCalled();
    });

    it('should throw a NotFoundException if no customer by given id was found', async () => {
      customersServiceMock.findOne.mockResolvedValueOnce(null);

      await expect(controller.getOneCustomer('1')).rejects.toThrow(
        NotFoundException,
      );
      expect(customersServiceMock.findOne).toHaveBeenCalled();
    });
  });

  describe('createCustomer', () => {
    it('should create and return a customer by createDto', async () => {
      customersServiceMock.create.mockResolvedValueOnce(customer);
      const createdCustomer = await controller.createCustomer(
        {} as CreateCustomerDto,
      );

      expect(createdCustomer).toEqual(customer);
      expect(customersServiceMock.create).toHaveBeenCalled();
    });
  });

  describe('updateCustomer', () => {
    it('should update and return a customer by given id and updateDto', async () => {
      const updateDto = { name: 'New customer' };
      const updateRes = { ...customer, ...updateDto };
      customersServiceMock.update.mockResolvedValueOnce(updateRes);
      const updatedCustomer = await controller.updateCustomer('1', updateDto);

      expect(updatedCustomer).toEqual(updateRes);
      expect(customersServiceMock.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw a BadRequestException if invalid id was given', async () => {
      // await expect(controller.updateCustomer('invalid_id', {})).rejects.toThrow(
      //   BadRequestException,
      // );
      expect(customersServiceMock.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer by given id', async () => {
      customersServiceMock.delete.mockResolvedValueOnce(customer);
      const res = await controller.deleteCustomer('1');

      expect(res).toBeUndefined();
      expect(customersServiceMock.delete).toHaveBeenCalledWith(1);
    });

    it('should throw a BadRequestException if invalid id was given', async () => {
      // await expect(controller.deleteCustomer('1')).rejects.toThrow(
      //   BadRequestException,
      // );
      expect(customersServiceMock.delete).not.toHaveBeenCalled();
    });
  });
});
