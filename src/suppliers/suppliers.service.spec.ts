import { Test, TestingModule } from '@nestjs/testing';
import { SuppliersService } from './suppliers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from './dtos/create-supplier.dto';

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
  let supplier: Supplier;

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
    supplier = { id: 1, name: 'supplier' } as Supplier;
  });

  it('suppliers service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a supplier by given id', async () => {
      suppliersRepoMock.findOneBy.mockResolvedValueOnce(supplier);
      const foundSupplier = await service.findOne(1);

      expect(foundSupplier).toEqual(supplier);
      expect(suppliersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      suppliersRepoMock.find.mockResolvedValueOnce([supplier]);
      const foundUsers = await service.findAll();

      expect(foundUsers).toEqual([supplier]);
      expect(suppliersRepoMock.find).toHaveBeenCalledTimes(1);
    });

    it('should return all users by given ids', async () => {
      suppliersRepoMock.find.mockResolvedValueOnce([supplier]);
      const foundUsers = await service.findAll([1]);

      expect(foundUsers).toEqual([supplier]);
      expect(foundUsers[0].id).toEqual(1);
      expect(suppliersRepoMock.find).toHaveBeenCalledTimes(1);
      expect(suppliersRepoMock.find).toHaveBeenCalledWith({
        where: { id: In([1]) },
      });
    });
  });

  describe('count', () => {
    it('should return the number of suppliers', async () => {
      suppliersRepoMock.count.mockResolvedValueOnce(1);
      const amountOfSuppliers = await service.count();

      expect(amountOfSuppliers).toEqual(1);
      expect(suppliersRepoMock.count).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a supplier by given createDto', async () => {
      suppliersRepoMock.save.mockResolvedValueOnce(supplier);
      const createdSupplier = await service.create({} as CreateSupplierDto);

      expect(createdSupplier).toEqual(supplier);
      expect(suppliersRepoMock.create).toHaveBeenCalled();
      expect(suppliersRepoMock.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return a supplier by given id and updateDto', async () => {
      const updateDto = { name: 'New Supplier Name' };
      const updateRes = {
        ...supplier,
        ...updateDto,
      };
      suppliersRepoMock.findOneBy.mockResolvedValueOnce(supplier);
      suppliersRepoMock.save.mockResolvedValueOnce(updateRes);
      const updatedSupplier = await service.update(1, updateDto);

      expect(updatedSupplier).toEqual(updateRes);
      expect(suppliersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(suppliersRepoMock.save).toHaveBeenCalledWith(updateRes);
    });

    it('should throw a NotFoundException if no supplier was found', async () => {
      suppliersRepoMock.findOneBy.mockResolvedValueOnce(undefined);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
      expect(suppliersRepoMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(suppliersRepoMock.save).not.toHaveBeenCalled();
    });
  });
});
