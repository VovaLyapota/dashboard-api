import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersService } from './suppliers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

class SuppliersRepoMock {
  find = jest.fn();
  findOneBy = jest.fn();
  create = jest.fn();
  save = jest.fn();
  count = jest.fn();
}

describe('SuppliersService', () => {
  let service: SuppliersService;
  let suppliersRepoMock: SuppliersRepoMock;
  let supplier: {
    id: number;
    name: string;
    address: string;
    company: string;
    date: string;
    amount: number;
    status: string;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliersService,
        {
          provide: getRepositoryToken(Supplier),
          useClass: SuppliersRepoMock,
        },
      ],
    }).compile();

    service = module.get<SuppliersService>(SuppliersService);
    suppliersRepoMock = module.get<SuppliersRepoMock>(
      getRepositoryToken(Supplier),
    );
    supplier = {
      id: 1,
      name: 'supplier',
      address: 'address',
      company: 'company',
      date: '01-01-01',
      amount: 100,
      status: 'Inactive',
    };
  });

  it('suppliers service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne - returns a supplier by given id', async () => {
    suppliersRepoMock.findOneBy.mockResolvedValueOnce(supplier);

    const foundSupplier = await service.findOne(1);

    expect(foundSupplier).toEqual(supplier);
    expect(suppliersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('findAll - returns all users', async () => {
    suppliersRepoMock.find.mockResolvedValueOnce([supplier]);

    const foundUsers = await service.findAll();

    expect(foundUsers).toEqual([supplier]);
    expect(suppliersRepoMock.find).toHaveBeenCalledTimes(1);
  });

  it('findAll - returns all users by given ids', async () => {
    suppliersRepoMock.find.mockResolvedValueOnce([supplier]);

    const foundUsers = await service.findAll([1]);

    expect(foundUsers).toEqual([supplier]);
    expect(suppliersRepoMock.find).toHaveBeenCalledWith({
      where: { id: In([1]) },
    });
    expect(foundUsers[0].id).toEqual(1);
    expect(suppliersRepoMock.find).toHaveBeenCalledTimes(1);
  });

  it('count - returns amount of all the suppliers', async () => {
    suppliersRepoMock.count.mockResolvedValueOnce(1);

    const amountOfSuppliers = await service.count();

    expect(amountOfSuppliers).toEqual(1);
    expect(suppliersRepoMock.count).toHaveBeenCalled();
  });

  it('create - creates and returns a supplier by given dto', async () => {
    suppliersRepoMock.save.mockResolvedValueOnce(supplier);

    const createdSupplier = await service.create(supplier);

    expect(createdSupplier).toEqual(supplier);
    expect(suppliersRepoMock.create).toHaveBeenCalledWith(supplier);
    expect(suppliersRepoMock.save).toHaveBeenCalled();
  });

  it('update - updates and returns a supplier by given id and options', async () => {
    const updateValues = { name: 'New Supplier Name', amount: 234.34 };
    suppliersRepoMock.findOneBy.mockResolvedValueOnce(supplier);
    suppliersRepoMock.save.mockResolvedValueOnce({
      ...supplier,
      ...updateValues,
    });

    const updatedSupplier = await service.update(1, updateValues);

    expect(updatedSupplier).toEqual({ ...supplier, ...updateValues });
    expect(suppliersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(suppliersRepoMock.save).toHaveBeenCalledWith({
      ...supplier,
      ...updateValues,
    });
  });

  it('update - throws a NotFoundException if no user was found', async () => {
    const updateValues = { name: 'New Supplier Name', amount: 234.34 };
    suppliersRepoMock.findOneBy.mockResolvedValueOnce(undefined);

    await expect(service.update(1, updateValues)).rejects.toThrow(
      NotFoundException,
    );
    expect(suppliersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(suppliersRepoMock.save).not.toHaveBeenCalled();
  });
});
