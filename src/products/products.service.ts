import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { GetProductsDto } from './dtos/get-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepo: Repository<Product>,
  ) {}

  findOne() {}

  findAll(options: GetProductsDto) {
    const { stock, minPrice, maxPrice, category, supplier } = options;
    const query = this.productsRepo.createQueryBuilder('product');

    if (stock !== undefined)
      query.where('product.stock BETWEEN :minStock AND :maxStock', {
        minStock: stock - 3,
        maxStock: stock + 3,
      });

    if (minPrice !== undefined)
      query.andWhere('product.price >= :minPrice', { minPrice });

    if (maxPrice !== undefined)
      query.andWhere('product.price <= :maxPrice', { maxPrice });

    if (category !== undefined)
      query.andWhere('product.category = :category', { category });

    if (supplier !== undefined)
      query.andWhere('product.supplier = :supplier', { supplier });

    return query.getMany();
  }

  create() {}

  update() {}

  delete() {}
}
