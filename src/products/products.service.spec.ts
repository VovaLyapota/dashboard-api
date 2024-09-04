import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CategoryEnum, Product } from './product.entity';
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
      photo: null,
      name: 'Product',
      price: 100,
      stock: 10,
      category: CategoryEnum.MEDICINE,
      suppliers: [{ id: 1, name: 'supplier' }],
    } as Product;
  });

  it('products service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne - returns a product by given id', async () => {
    productsRepoMock.findOne.mockResolvedValueOnce(product);

    const foundProduct = await service.findOne(1);

    expect(foundProduct).toEqual(product);
    expect(productsRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { suppliers: true },
    });
  });

  it('findAll - returns products based on filter criteria', async () => {
    const getProductsDto = {
      stock: 10,
      minPrice: '50',
      maxPrice: '150',
      category: CategoryEnum.MEDICINE,
    };
    productsRepoMock
      .createQueryBuilder()
      .getMany.mockResolvedValueOnce([product]);

    const foundProducts = await service.findAll(getProductsDto);

    expect(foundProducts).toEqual([product]);
    expect(productsRepoMock.createQueryBuilder).toHaveBeenCalled();
  });

  it('count - returns the count of all products', async () => {
    productsRepoMock.count.mockResolvedValueOnce(5);

    const count = await service.count();

    expect(count).toEqual(5);
    expect(productsRepoMock.count).toHaveBeenCalled();
  });

  it('create - creates and returns a product by given dto', async () => {
    const createProductDto: CreateProductDto = {
      photo: null,
      name: 'New Product',
      price: 200,
      stock: 20,
      category: CategoryEnum.HEAD,
      suppliers: [1],
    };

    const { suppliers, ...rest } = createProductDto;
    productsRepoMock.create.mockReturnValue(product);
    productsRepoMock.save.mockResolvedValue(product);
    suppliersServiceMock.findAll.mockResolvedValue([]);

    const createdProduct = await service.create(createProductDto);

    expect(createdProduct).toEqual(product);
    expect(productsRepoMock.create).toHaveBeenCalledWith(rest);
    expect(productsRepoMock.save).toHaveBeenCalledWith(product);
    expect(suppliersServiceMock.findAll).toHaveBeenCalledWith(
      createProductDto.suppliers,
    );
  });

  it('update - updates and returns a product by given id and options', async () => {
    const updateValues: UpdateProductDto = {
      name: 'Updated Product',
      price: 250,
      suppliers: [2],
    };
    const newSupplier = { id: 2, name: 'new supplier' };
    productsRepoMock.findOne.mockResolvedValueOnce(product);
    productsRepoMock.save.mockResolvedValue({ ...product, ...updateValues });
    suppliersServiceMock.findAll.mockResolvedValue([newSupplier]);

    const updatedProduct = await service.update(1, updateValues);

    expect(updatedProduct).toEqual({ ...product, ...updateValues });
    expect(productsRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: {
        suppliers: true,
      },
    });
    expect(productsRepoMock.save).toHaveBeenCalledWith({
      ...product,
      ...updateValues,
      suppliers: [newSupplier],
    });
    expect(suppliersServiceMock.findAll).toHaveBeenCalledWith(
      updateValues.suppliers,
    );
  });

  it('update - throws a NotFoundException if no product was found', async () => {
    const updateValues: UpdateProductDto = {
      name: 'Updated Product',
      price: 250,
    };
    productsRepoMock.findOne.mockResolvedValueOnce(null);

    await expect(service.update(1, updateValues)).rejects.toThrow(
      NotFoundException,
    );
    expect(productsRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: {
        suppliers: true,
      },
    });
    expect(productsRepoMock.save).not.toHaveBeenCalled();
  });

  it('delete - deletes a product and its relations with suppliers', async () => {
    productsRepoMock.findOne.mockResolvedValueOnce(product);
    productsRepoMock.remove.mockResolvedValue(product);

    const deletedProduct = await service.delete(1);

    expect(deletedProduct).toEqual(product);
    expect(productsRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: {
        suppliers: true,
      },
    });
    expect(productsRepoMock.remove).toHaveBeenCalledWith(product);
    expect(productsRepoMock.createQueryBuilder).toHaveBeenCalled();
  });

  it('delete - throws a BadRequestException if product is not found', async () => {
    productsRepoMock.findOne.mockResolvedValueOnce(null);

    await expect(service.delete(1)).rejects.toThrow(BadRequestException);
    expect(productsRepoMock.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { suppliers: true },
    });
    expect(productsRepoMock.createQueryBuilder).not.toHaveBeenCalled();
  });
});
