import { Supplier } from '../suppliers/supplier.entity';
import {
  AfterInsert,
  AfterUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CategoryEnum {
  MEDICINE = 'Medicine',
  HEART = 'Heart',
  HEAD = 'Head',
  HAND = 'Hand',
  LEG = 'Leg',
  DENTAL_CARE = 'Dental Care',
  SKIN_CARE = 'Skin Care',
}

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  photo: string | null;

  @Column()
  name: string;

  @Column()
  stock: number;

  @Column({
    type: 'float',
  })
  price: number;

  // @Column({
  //   type: 'enum',
  //   enum: CategoryEnum,
  //   default: CategoryEnum.MEDICINE,
  // })
  // category: CategoryEnum;
  @Column({
    default: CategoryEnum.MEDICINE,
  })
  category: `${CategoryEnum}`;

  // Many-to-many relation with supplier entity
  @ManyToMany(() => Supplier, (supplier) => supplier.product)
  @JoinTable()
  suppliers: Supplier[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted new product with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Product with id ', this.id, ' was updated');
  }
}
