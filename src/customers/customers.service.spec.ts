import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { GetCustomersDto } from './dtos/get-customers.dto';

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
    customer = { id: 1, name: 'customer' } as Customer;
  });

  it('customers service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the customer by given id', async () => {
      customersRepoMock.findOneBy.mockResolvedValueOnce(customer);
      const foundCustomer = await service.findOne(1);

      expect(foundCustomer).toEqual(customer);
      expect(customersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('findAll', () => {
    it('should return all the customers by given getDto', async () => {
      customersRepoMock
        .createQueryBuilder()
        .getMany.mockResolvedValueOnce([customer]);
      const foundCustomers = await service.findAll({} as GetCustomersDto);

      expect(foundCustomers).toEqual([customer]);
      expect(customersRepoMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('count', () => {
    it('should return the total number of customers', async () => {
      customersRepoMock.count.mockResolvedValueOnce(3);
      const numberOfCustomers = await service.count();

      expect(numberOfCustomers).toEqual(3);
      expect(customersRepoMock.count).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a customer by given createDto', async () => {
      customersRepoMock.create.mockReturnValueOnce(customer);
      customersRepoMock.save.mockResolvedValueOnce(customer);
      const createdCustomer = await service.create({} as CreateCustomerDto);

      expect(createdCustomer).toEqual(customer);
      expect(customersRepoMock.create).toHaveBeenCalled();
      expect(customersRepoMock.save).toHaveBeenCalledWith(customer);
    });
  });

  describe('update', () => {
    it('should update and return a customer by given id and updateDto', async () => {
      const updateDto = { name: 'New customer' };
      const updateRes = { ...customer, ...updateDto };
      customersRepoMock.findOneBy.mockResolvedValueOnce(customer);
      customersRepoMock.save.mockResolvedValueOnce(updateRes);
      const updatedCustomer = await service.update(1, updateDto);

      expect(updatedCustomer).toEqual(updateRes);
      expect(customersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(customersRepoMock.save).toHaveBeenCalledWith(updateRes);
    });

    it('should throw a NotFoundException if no customer was found by given id', async () => {
      customersRepoMock.findOneBy.mockResolvedValueOnce(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
      expect(customersRepoMock.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a customer by given id', async () => {
      customersRepoMock.findOneBy.mockResolvedValueOnce(customer);
      customersRepoMock.remove.mockResolvedValueOnce(customer);
      const deletedCustomer = await service.delete(1);

      expect(deletedCustomer).toEqual(customer);
      expect(customersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(customersRepoMock.remove).toHaveBeenCalledWith(customer);
    });

    it('should throw a BadRequestException if an invalid id was given', async () => {
      customersRepoMock.findOneBy.mockResolvedValueOnce(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
      expect(customersRepoMock.remove).not.toHaveBeenCalled();
    });
  });
});
