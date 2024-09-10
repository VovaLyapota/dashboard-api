import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { GetProductsDto } from './dtos/get-products.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

class ProductsRepoMock {
  findOne = jest.fn();
  count = jest.fn();
  create = jest.fn();
  save = jest.fn();
  remove = jest.fn();
  createQueryBuilder = jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    relation: jest.fn().mockReturnThis(),
    of: jest.fn().mockReturnThis(),
    remove: jest.fn().mockResolvedValue(undefined),
  });
}

class SuppliersServiceMock {
  findAll = jest.fn();
}

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepoMock: ProductsRepoMock;
  let suppliersServiceMock: SuppliersServiceMock;
  let product: Product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: ProductsRepoMock,
        },
        {
          provide: SuppliersService,
          useClass: SuppliersServiceMock,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepoMock = module.get<ProductsRepoMock>(
      getRepositoryToken(Product),
    );
    suppliersServiceMock = module.get<SuppliersServiceMock>(SuppliersService);
    product = {
      id: 1,
      name: 'product',
      suppliers: [{ id: 1, name: 'supplier' }],
    } as Product;
  });

  it('products service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a product by given id', async () => {
      productsRepoMock.findOne.mockResolvedValueOnce(product);
      const foundProduct = await service.findOne(1);

      expect(foundProduct).toEqual(product);
      expect(productsRepoMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { suppliers: true },
      });
    });
  });

  describe('findAll', () => {
    it('should return products based on getDto', async () => {
      productsRepoMock
        .createQueryBuilder()
        .getMany.mockResolvedValueOnce([product]);
      const foundProducts = await service.findAll({} as GetProductsDto);

      expect(foundProducts).toEqual([product]);
      expect(productsRepoMock.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('count', () => {
    it('should return the number of all products', async () => {
      productsRepoMock.count.mockResolvedValueOnce(5);
      const count = await service.count();

      expect(count).toEqual(5);
      expect(productsRepoMock.count).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a product by given createDto', async () => {
      productsRepoMock.create.mockReturnValue(product);
      productsRepoMock.save.mockResolvedValue(product);
      suppliersServiceMock.findAll.mockResolvedValue([]);
      const createdProduct = await service.create({} as CreateProductDto);

      expect(createdProduct).toEqual(product);
      expect(productsRepoMock.create).toHaveBeenCalled();
      expect(productsRepoMock.save).toHaveBeenCalledWith(product);
    });
  });

  describe('update', () => {
    it('should update and return a product by given id and updateDto', async () => {
      const updateDto = {
        name: 'Updated Product',
        suppliers: [2],
      };
      const supplier = { id: 2, name: 'new supplier' };
      const updateRes = { ...product, ...updateDto, suppliers: [supplier] };
      productsRepoMock.findOne.mockResolvedValueOnce(product);
      suppliersServiceMock.findAll.mockResolvedValue([supplier]);
      productsRepoMock.save.mockResolvedValueOnce(updateRes);
      const updatedProduct = await service.update(1, updateDto);

      expect(updatedProduct).toEqual(updateRes);
      expect(productsRepoMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: {
          suppliers: true,
        },
      });
      expect(productsRepoMock.save).toHaveBeenCalledWith(updateRes);
      expect(suppliersServiceMock.findAll).toHaveBeenCalledWith(
        updateDto.suppliers,
      );
    });

    it('should throw a NotFoundException if no product was found', async () => {
      productsRepoMock.findOne.mockResolvedValueOnce(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
      expect(productsRepoMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { suppliers: true },
      });
      expect(productsRepoMock.save).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a product and its relations with suppliers', async () => {
      productsRepoMock.findOne.mockResolvedValueOnce(product);
      productsRepoMock.remove.mockResolvedValueOnce(product);
      const deletedProduct = await service.delete(1);

      expect(deletedProduct).toEqual(product);
      expect(productsRepoMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { suppliers: true },
      });
      expect(productsRepoMock.createQueryBuilder).toHaveBeenCalled();
      expect(productsRepoMock.remove).toHaveBeenCalledWith(product);
    });

    it('should throw a BadRequestException if product is not found', async () => {
      productsRepoMock.findOne.mockResolvedValueOnce(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
      expect(productsRepoMock.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: { suppliers: true },
      });
      expect(productsRepoMock.createQueryBuilder).not.toHaveBeenCalled();
    });
  });
});
