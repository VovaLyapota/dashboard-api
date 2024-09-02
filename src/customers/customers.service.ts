import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { Repository } from 'typeorm';
import { GetCustomersDto } from './dtos/get-customers.dto';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private customersRepo: Repository<Customer>,
  ) {}

  async findOne(id: number) {
    return await this.customersRepo.findOneBy({ id });
  }

  async findAll(getCustomersDto: GetCustomersDto) {
    const { name, email, minSpent, maxSpent, phone, address } = getCustomersDto;
    const query = this.customersRepo.createQueryBuilder('customer');

    if (name !== undefined)
      query.where('customer.name LIKE :name', {
        name: `%${name}%`,
      });
    if (email !== undefined)
      query.where('customer.email LIKE :email', {
        email: `%${email}%`,
      });
    if (phone !== undefined)
      query.where('customer.phone LIKE :phone', {
        phone: `%${phone}%`,
      });
    if (address !== undefined)
      query.where('customer.address LIKE :address', {
        address: `%${address}%`,
      });
    if (minSpent !== undefined)
      query.andWhere('customer.spent >= :minSpent', { minSpent });
    if (maxSpent !== undefined)
      query.andWhere('customer.spent <= :maxSpent', { maxSpent });

    return await query.getMany();
  }

  async count() {
    return await this.customersRepo.count();
  }

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customersRepo.create(createCustomerDto);

    return await this.customersRepo.save(customer);
  }

  async update(id: number, updateValues: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    if (!customer)
      throw new NotFoundException('Customer with such an id is not found.');

    Object.assign(customer, updateValues);
    return await this.customersRepo.save(customer);
  }

  async delete(id: number) {
    const customer = await this.findOne(id);
    if (!customer)
      throw new BadRequestException("Customer with such an id doesn't exist");

    return await this.customersRepo.remove(customer);
  }
}
