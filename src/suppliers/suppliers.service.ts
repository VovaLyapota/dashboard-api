import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier) private suppliersRepo: Repository<Supplier>,
  ) {}

  async findOne(id: number) {
    return await this.suppliersRepo.findOneBy({ id });
  }

  async findAll() {
    return await this.suppliersRepo.find();
  }

  async create(supplierData: Supplier) {
    const supplier = this.suppliersRepo.create(supplierData);

    return await this.suppliersRepo.save(supplier);
  }

  async update(id: number, updateValues: Partial<Supplier>) {
    const supplier = await this.findOne(id);
    Object.assign(supplier, updateValues);

    return await this.suppliersRepo.save(supplier);
  }
}
