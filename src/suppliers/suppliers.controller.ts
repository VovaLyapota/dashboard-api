import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSupplierDto } from './dtos/create-supplier.dto';
import { UpdateSupplierDto } from './dtos/update-supplier.dto';
import { SuppliersService } from './suppliers.service';

@Controller('suppliers')
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Get()
  async getAllSuppliers() {
    const suppliers = await this.suppliersService.findAll();
    if (!suppliers.length)
      throw new NotFoundException("There aren't any suppliers");

    return suppliers;
  }

  @Post()
  createSupplier(@Body() body: CreateSupplierDto) {
    return this.suppliersService.create(body);
  }

  @Patch('/:id')
  updateSupplier(@Param('id') id: string, @Body() body: UpdateSupplierDto) {
    if (!+id) throw new BadRequestException('Invalid id property');

    return this.suppliersService.update(+id, body);
  }
}
