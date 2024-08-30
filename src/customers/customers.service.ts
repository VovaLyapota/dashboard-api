import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) customersRepo: Repository<Customer>,
  ) {}

  findAll() {}

  findOne() {}

  create() {}

  update() {}

  delete() {}
}
