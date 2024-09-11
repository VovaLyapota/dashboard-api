import { Expose, Transform } from 'class-transformer';
import { CategoryEnum } from '../product.entity';
import { Supplier } from '../../suppliers/supplier.entity';

export class ProductDto {
  @Expose()
  id: number;

  @Expose()
  photo: null;

  @Expose()
  name: string;

  @Expose()
  stock: number;

  @Expose()
  price: number;

  @Expose()
  category: CategoryEnum;

  @Transform(
    ({ obj: { suppliers } }) =>
      suppliers?.map((supplier: Supplier) => ({
        id: supplier.id,
        name: supplier.name,
        company: supplier.company,
      })) || [],
  )
  @Expose()
  suppliers: {
    id: number;
    name: string;
    company: string;
  };
}
