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
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateProductDto } from './dtos/create-product.dto';
import { GetProductsDto } from './dtos/get-products.dto';
import { ProductDto } from './dtos/product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
@Serialize(ProductDto)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() query: GetProductsDto) {
    const products = await this.productsService.findAll(query);
    if (!products.length)
      throw new NotFoundException('There are no any products.');

    return products;
  }

  @Get('/:id')
  async getOneProduct(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('Invalid id property');

    const product = await this.productsService.findOne(+id);
    if (!product)
      throw new NotFoundException('There is no a product with such an id');

    return product;
  }

  @Post()
  createProduct(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Put('/:id')
  updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
    if (!+id) throw new BadRequestException('Invalid id property');

    return this.productsService.update(+id, body);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteProduct(@Param('id') id: string) {
    if (!+id) throw new BadRequestException('Invalid id property');

    return this.productsService.delete(+id);
  }
}
