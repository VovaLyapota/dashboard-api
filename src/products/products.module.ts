import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { SuppliersService } from 'src/suppliers/suppliers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), SuppliersService],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
