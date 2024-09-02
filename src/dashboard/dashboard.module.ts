import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ProductsModule } from 'src/products/products.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { CustomersModule } from 'src/customers/customers.module';

@Module({
  imports: [ProductsModule, SuppliersModule, CustomersModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
