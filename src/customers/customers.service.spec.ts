import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { GetCustomersDto } from './dtos/get-customers.dto';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

class CustomersRepoMock {
  findOneBy = jest.fn();
  count = jest.fn();
  create = jest.fn();
  save = jest.fn();
  remove = jest.fn();
  createQueryBuilder = jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  });
}

describe('CustomersService', () => {
  let service: CustomersService;
  let customersRepoMock: CustomersRepoMock;
  let customer: Customer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useClass: CustomersRepoMock,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    customersRepoMock = module.get<CustomersRepoMock>(
      getRepositoryToken(Customer),
    );
    customer = {
      id: 1,
      image: null,
      name: 'Customer',
      email: 'customer@gmail.com',
      spent: 129,
      phone: '+38000000000',
      address: 'address',
      registeredAt: '01-01-2021',
    } as Customer;
  });

  it('customers service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne - returns the customer by given id', async () => {
    customersRepoMock.findOneBy.mockResolvedValueOnce(customer);
    const foundCustomer = await service.findOne(1);

    expect(foundCustomer).toEqual(customer);
    expect(customersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('findAll - returns all the customers by given options', async () => {
    customersRepoMock
      .createQueryBuilder()
      .getMany.mockResolvedValueOnce([customer]);
    const foundCustomers = await service.findAll({} as GetCustomersDto);

    expect(foundCustomers).toEqual([customer]);
    expect(customersRepoMock.createQueryBuilder).toHaveBeenCalled();
  });

  it('count - returns a number of the whole customers', async () => {
    customersRepoMock.count.mockResolvedValueOnce(3);
    const numberOfCustomers = await service.count();

    expect(numberOfCustomers).toEqual(3);
    expect(customersRepoMock.count).toHaveBeenCalled();
  });

  it('create - creates and returns a customer by given dto', async () => {
    customersRepoMock.create.mockReturnValueOnce(customer);
    customersRepoMock.save.mockResolvedValueOnce(customer);
    const createdCustomer = await service.create({} as CreateCustomerDto);

    expect(createdCustomer).toEqual(customer);
    expect(customersRepoMock.create).toHaveBeenCalled();
    expect(customersRepoMock.save).toHaveBeenCalledWith(customer);
  });

  it('update - updates and returns a customer by given id and update dto', async () => {
    const updateCustomerDto = { spent: 500 };
    customersRepoMock.findOneBy.mockResolvedValueOnce(customer);
    customersRepoMock.save.mockResolvedValueOnce({
      ...customer,
      ...updateCustomerDto,
    });
    const updatedCustomer = await service.update(1, updateCustomerDto);

    expect(updatedCustomer).toEqual({ ...customer, ...updateCustomerDto });
    expect(customersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(customersRepoMock.save).toHaveBeenCalled();
  });

  it('update - throws a NotFoundException if no customer was found by given id', async () => {
    customersRepoMock.findOneBy.mockResolvedValueOnce(null);

    await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    expect(customersRepoMock.save).not.toHaveBeenCalled();
  });

  it('delete - deletes a customer by given id', async () => {
    customersRepoMock.findOneBy.mockResolvedValueOnce(customer);
    customersRepoMock.remove.mockResolvedValueOnce(customer);
    const deletedCustomer = await service.delete(1);

    expect(deletedCustomer).toEqual(customer);
    expect(customersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(customersRepoMock.remove).toHaveBeenCalledWith(customer);
  });

  it('delete - throws a BadRequestException if invalid id was given', async () => {
    customersRepoMock.findOneBy.mockResolvedValueOnce(null);

    await expect(service.delete(1)).rejects.toThrow(BadRequestException);
    expect(customersRepoMock.remove).not.toHaveBeenCalled();
  });
});
