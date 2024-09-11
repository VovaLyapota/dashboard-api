import { Product } from '../products/product.entity';
import {
  AfterInsert,
  AfterUpdate,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum SupplierStatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  company: string;

  @Column()
  date: string;

  @Column({
    type: 'float',
  })
  amount: number;

  // @Column({
  //   type: 'enum',
  //   enum: SupplierStatusEnum,
  //   default: SupplierStatusEnum.INACTIVE,
  // })
  // status: SupplierStatusEnum;
  @Column({ default: SupplierStatusEnum.INACTIVE })
  status: `${SupplierStatusEnum}`;

  @ManyToMany(() => Product, (product) => product.suppliers)
  product: Product[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted new supplier with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Supplier with id ', this.id, ' was updated');
  }
}
