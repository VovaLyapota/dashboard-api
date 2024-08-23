import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dtos/create-supplier.dto';
import { Supplier } from './supplier.entity';
import { UpdateSupplierDto } from './dtos/update-supplier.dto';

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
    return this.suppliersService.create(body as Supplier);
  }

  @Patch('/:id')
  updateSupplier(@Param('id') id: string, @Body() body: UpdateSupplierDto) {
    return this.suppliersService.update(+id, body as Partial<Supplier>);
  }
}
