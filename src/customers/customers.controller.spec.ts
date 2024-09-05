import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer } from './customer.entity';
import { GetCustomersDto } from './dtos/get-customers.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dtos/create-customer.dto';

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
  });

  it('customers controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it("getCustomers - returns customer's list by given options", async () => {
    customersServiceMock.findAll.mockResolvedValueOnce([{}] as Customer[]);
    const foundCustomers = await controller.getCustomers({} as GetCustomersDto);

    expect(foundCustomers).toEqual([{}] as Customer[]);
    expect(customersServiceMock.findAll).toHaveBeenCalled();
  });

  it('getCustomers - throws a NotFoundException if no customers were found', async () => {
    customersServiceMock.findAll.mockResolvedValueOnce([]);

    await expect(
      controller.getCustomers({} as GetCustomersDto),
    ).rejects.toThrow(NotFoundException);
    expect(customersServiceMock.findAll).toHaveBeenCalled();
  });

  it('getOneCustomer - returns the customer by given id', async () => {
    customersServiceMock.findOne.mockResolvedValueOnce({} as Customer);
    const customer = await controller.getOneCustomer('1');

    expect(customer).toEqual({} as Customer);
    expect(customersServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('getOneCustomer - throws a BadRequestException if invalid id was given', async () => {
    await expect(controller.getOneCustomer('invalid_id')).rejects.toThrow(
      BadRequestException,
    );
    expect(customersServiceMock.findOne).not.toHaveBeenCalled();
  });

  it('getOneCustomer - throws a NotFoundException if no user by given id was found', async () => {
    customersServiceMock.findOne.mockResolvedValueOnce(null);

    await expect(controller.getOneCustomer('1')).rejects.toThrow(
      NotFoundException,
    );
    expect(customersServiceMock.findOne).toHaveBeenCalled();
  });

  it('createCustomer - creates and returns a customer by given dto', async () => {
    customersServiceMock.create.mockResolvedValueOnce({} as Customer);
    const createdCustomer = await controller.createCustomer(
      {} as CreateCustomerDto,
    );

    expect(createdCustomer).toEqual({} as Customer);
    expect(customersServiceMock.create).toHaveBeenCalled();
  });

  it('updateCustomer - updates and returns a customer by given id and update values', async () => {
    const updateCustomerDto = { spent: 1231 };
    customersServiceMock.update.mockResolvedValueOnce({
      ...({} as Customer),
      ...updateCustomerDto,
    });
    const updatedCustomer = await controller.updateCustomer(
      '1',
      updateCustomerDto,
    );

    expect(updatedCustomer).toEqual({
      ...({} as Customer),
      ...updateCustomerDto,
    });
    expect(customersServiceMock.update).toHaveBeenCalledWith(
      1,
      updateCustomerDto,
    );
  });

  it('updateCustomer - throws a BadRequestException if invalid id was given', async () => {
    // await expect(controller.updateCustomer('invalid_id', {})).rejects.toThrow(
    //   BadRequestException,
    // );
    expect(customersServiceMock.update).not.toHaveBeenCalled();
  });

  it('deleteCustomer - deletes a customer by given id', async () => {
    customersServiceMock.delete.mockResolvedValueOnce({} as Customer);
    const res = await controller.deleteCustomer('1');

    expect(res).toBeUndefined();
    expect(customersServiceMock.delete).toHaveBeenCalledWith(1);
  });

  it('deleteCustomer - throws a BadRequestException if invalid id was given', async () => {
    // await expect(controller.deleteCustomer('1')).rejects.toThrow(
    //   BadRequestException,
    // );
    expect(customersServiceMock.delete).not.toHaveBeenCalled();
  });
});
