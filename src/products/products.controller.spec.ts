import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dtos/create-product.dto';
import { GetProductsDto } from './dtos/get-products.dto';
import { Product } from './product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

class ProductsServiceMock {
  findAll = jest.fn();
  findOne = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}

describe('ProductsController', () => {
  let controller: ProductsController;
  let productsServiceMock: ProductsServiceMock;
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
    productsServiceMock = module.get<ProductsServiceMock>(ProductsService);
    product = { id: 1, name: 'product' } as Product;
  });

  it('products controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      productsServiceMock.findAll.mockResolvedValue([product]);
      const foundProducts = await controller.getProducts({} as GetProductsDto);

      expect(foundProducts).toEqual([product]);
      expect(productsServiceMock.findAll).toHaveBeenCalled();
    });

    it('should throw a NotFoundException if no products found', async () => {
      productsServiceMock.findAll.mockResolvedValue([]);

      await expect(
        controller.getProducts({} as GetProductsDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOneProduct', () => {
    it('should return a product by id', async () => {
      productsServiceMock.findOne.mockResolvedValue(product);
      const result = await controller.getOneProduct('1');

      expect(result).toEqual(product);
      expect(productsServiceMock.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw a BadRequestException if id is not a number', async () => {
      await expect(controller.getOneProduct('invalid_id')).rejects.toThrow(
        BadRequestException,
      );
      expect(productsServiceMock.findOne).not.toHaveBeenCalled();
    });

    it('should throw a NotFoundException if product not found', async () => {
      productsServiceMock.findOne.mockResolvedValue(null);

      await expect(controller.getOneProduct('1')).rejects.toThrow(
        NotFoundException,
      );
      expect(productsServiceMock.findOne).toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
    it('should create and return a product by given createDto', async () => {
      productsServiceMock.create.mockResolvedValue(product);
      const result = await controller.createProduct({} as CreateProductDto);

      expect(result).toEqual(product);
      expect(productsServiceMock.create).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('should update and return a product by id and updateDto', async () => {
      const updateDto = { name: 'Updated Product' };
      const updateRes = { ...product, ...updateDto };
      productsServiceMock.update.mockResolvedValue(updateRes);
      const result = await controller.updateProduct('1', updateDto);

      expect(result).toEqual(updateRes);
      expect(productsServiceMock.update).toHaveBeenCalledWith(1, updateDto);
    });

    // it('should throw BadRequestException if id is not valid', async () => {
    //   await expect(controller.updateProduct('invalid_id', {})).rejects.toThrow(
    //     BadRequestException,
    //   );
    // });
  });

  describe('deleteProduct', () => {
    it('should delete a product by id', async () => {
      productsServiceMock.delete.mockResolvedValue(product);
      const result = await controller.deleteProduct('1');

      expect(result).toBeUndefined();
      expect(productsServiceMock.delete).toHaveBeenCalledWith(1);
    });

    it('should throw BadRequestException if id is not a number', async () => {
      await expect(controller.deleteProduct('invalid_id')).rejects.toThrow(
        BadRequestException,
      );
      expect(productsServiceMock.delete).not.toHaveBeenCalled();
    });
  });
});
