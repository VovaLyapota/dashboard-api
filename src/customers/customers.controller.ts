import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { GetCustomersDto } from './dtos/get-customers.dto';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  async getCustomers(@Query() query: GetCustomersDto) {
    const customers = await this.customersService.findAll(query);
    if (!customers.length)
      throw new NotFoundException('There are no any customers.');

    return customers;
  }

  @Get('/:id')
  async getOneCustomer(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('Invalid id property');

    const customer = await this.customersService.findOne(+id);
    if (!customer)
      throw new NotFoundException('There is no customer with such an id');

    return customer;
  }

  @Post()
  createCustomer(@Body() body: CreateCustomerDto) {
    return this.customersService.create(body);
  }

  @Put('/:id')
  updateCustomer(@Param('id') id: string, @Body() body: UpdateCustomerDto) {
    if (!+id) throw new BadRequestException('Invalid id property');

    return this.customersService.update(+id, body);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCustomer(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('Invalid id property');

    await this.customersService.delete(+id);
  }
}
