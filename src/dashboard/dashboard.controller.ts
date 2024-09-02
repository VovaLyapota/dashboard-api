import { Controller, Get } from '@nestjs/common';
import { CustomersService } from 'src/customers/customers.service';
import { ProductsService } from 'src/products/products.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private productsService: ProductsService,
    private suppliersService: SuppliersService,
    private customersService: CustomersService,
  ) {}

  @Get()
  async getDashboard() {
    const [products, suppliers, customers] = await Promise.all([
      this.productsService.count(),
      this.suppliersService.count(),
      this.customersService.count(),
    ]);

    return {
      products,
      suppliers,
      customers,
    };
  }
}
