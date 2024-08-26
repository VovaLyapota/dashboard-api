import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { GetProductsDto } from './dtos/get-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepo: Repository<Product>,
    private suppliersService: SuppliersService,
  ) {}

  async findOne(id: number) {
    return await this.productsRepo.findOneBy({ id });
  }

  async findAll(getProductsDto: GetProductsDto) {
    const { stock, minPrice, maxPrice, category, supplier } = getProductsDto;
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

    return await query.getMany();
  }

  async create(productDto: CreateProductDto) {
    const { suppliers: suppliersIds, ...rest } = productDto;
    const product = this.productsRepo.create(rest);

    product.suppliers = await this.suppliersService.findAll(suppliersIds);
    return await this.productsRepo.save(product);
  }

  async update(id: number, updateValues: UpdateProductDto) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException('There is no such a product');

    Object.assign(product, updateValues);
    return await this.productsRepo.save(product);
  }

  async delete(id: number) {
    const product = await this.findOne(id);
    if (!product)
      throw new NotFoundException('Product with such an id is not found');

    return await this.productsRepo.remove(product);
  }
}
