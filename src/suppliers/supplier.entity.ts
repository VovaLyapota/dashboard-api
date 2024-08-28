import { Product } from 'src/products/product.entity';
import {
  AfterInsert,
  AfterUpdate,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
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
  suppliers: string;

  @Column()
  date: string;

  @Column({
    type: 'float',
  })
  amount: number;

  // @Column({
  //   type: 'enum',
  //   enum: StatusEnum,
  //   default: StatusEnum.INACTIVE,
  // })
  // status: StatusEnum;
  @Column({ default: StatusEnum.INACTIVE })
  status: `${StatusEnum}`;

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
