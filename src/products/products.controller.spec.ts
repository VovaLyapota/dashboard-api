import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { GetProductsDto } from './dtos/get-products.dto';
import { CategoryEnum, Product } from './product.entity';

class ProductsServiceMock {
  findAll = jest.fn();
  findOne = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe('ProductsController', () => {
  let controller: ProductsController;
  let serviceMock: ProductsServiceMock;
  let product: Product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useClass: ProductsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    serviceMock = module.get<ProductsServiceMock>(ProductsService);
    product = {
      id: 1,
      name: 'Product',
      price: 100,
      stock: 10,
      category: CategoryEnum.MEDICINE,
      suppliers: [],
    } as Product;
  });

  it('products controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getProducts - returns a list of products', async () => {
    const query = { stock: 3 };
    const products = [product];
    serviceMock.findAll.mockResolvedValue(products);

    const result = await controller.getProducts(query as GetProductsDto);

    expect(result).toEqual(products);
    expect(serviceMock.findAll).toHaveBeenCalledWith(query);
  });

  it('getProducts - throws a NotFoundException if no products found', async () => {
    const query = { stock: 3 };
    serviceMock.findAll.mockResolvedValue([]);

    await expect(
      controller.getProducts(query as GetProductsDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('getOneProduct - returns a product by id', async () => {
    const productId = '1';
    serviceMock.findOne.mockResolvedValue(product);

    const result = await controller.getOneProduct(productId);

    expect(result).toEqual(product);
    expect(serviceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('getOneProduct - throws a BadRequestException if id is not a number', async () => {
    await expect(controller.getOneProduct('invalid_id')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('getOneProduct - throws a NotFoundException if product not found', async () => {
    const productId = '1';
    serviceMock.findOne.mockResolvedValue(null);

    await expect(controller.getOneProduct(productId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('createProduct - creates and returns a product', async () => {
    const createProductDto = {
      name: 'New Product',
      price: 200,
      stock: 20,
      category: CategoryEnum.HEAD,
      suppliers: [1],
    };
    serviceMock.create.mockResolvedValue(product);

    const result = await controller.createProduct(
      createProductDto as CreateProductDto,
    );
    expect(result).toEqual(product);
    expect(serviceMock.create).toHaveBeenCalledWith(createProductDto);
  });

  it('updateProduct - updates and returns a product by id', async () => {
    const updateProductDto: UpdateProductDto = {
      name: 'Updated Product',
      price: 250,
      suppliers: [2],
    };
    serviceMock.update.mockResolvedValue({ ...product, ...updateProductDto });

    const result = await controller.updateProduct('1', updateProductDto);

    expect(result).toEqual({ ...product, ...updateProductDto });
    expect(serviceMock.update).toHaveBeenCalledWith(1, updateProductDto);
  });

  // it('updateProduct - throws BadRequestException if id is not a number', async () => {
  //   await expect(
  //     controller.updateProduct('invalid_id', {} as UpdateProductDto),
  //   ).rejects.toThrow(BadRequestException);
  // });

  it('deleteProduct - deletes a product by id', async () => {
    serviceMock.delete.mockResolvedValue(product);

    const result = await controller.deleteProduct('1');
    expect(result).toBeUndefined();
    expect(serviceMock.delete).toHaveBeenCalledWith(1);
  });

  it('deleteProduct - throws BadRequestException if id is not a number', async () => {
    await expect(controller.deleteProduct('invalid_id')).rejects.toThrow(
      BadRequestException,
    );
  });
});
