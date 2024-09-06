import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { ProductsService } from 'src/products/products.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { CustomersService } from 'src/customers/customers.service';

class ServiceClass {
  count = jest.fn();
}
class ProductsServiceMock extends ServiceClass {}
class SuppliersServiceMock extends ServiceClass {}
class CustomersServiceMock extends ServiceClass {}

describe('DashboardController', () => {
  let controller: DashboardController;
  let productsServiceMock: ProductsServiceMock;
  let suppliersServiceMock: SuppliersServiceMock;
  let customersServiceMock: CustomersServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        { provide: ProductsService, useClass: ProductsServiceMock },
        { provide: SuppliersService, useClass: SuppliersServiceMock },
        { provide: CustomersService, useClass: CustomersServiceMock },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    productsServiceMock = module.get<ProductsServiceMock>(ProductsService);
    suppliersServiceMock = module.get<SuppliersServiceMock>(SuppliersService);
    customersServiceMock = module.get<CustomersServiceMock>(CustomersService);
  });

  it('dashboard controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should return the number of products, suppliers, and customers', async () => {
      productsServiceMock.count.mockResolvedValueOnce(4);
      suppliersServiceMock.count.mockResolvedValueOnce(3);
      customersServiceMock.count.mockResolvedValueOnce(7);

      const dashboard = await controller.getDashboard();

      expect(dashboard).toEqual({ products: 4, suppliers: 3, customers: 7 });
      expect(productsServiceMock.count).toHaveBeenCalled();
      expect(suppliersServiceMock.count).toHaveBeenCalled();
      expect(customersServiceMock.count).toHaveBeenCalled();
    });
  });
});
