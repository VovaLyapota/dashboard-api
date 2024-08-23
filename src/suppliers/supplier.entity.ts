import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Status {
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

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.INACTIVE,
  })
  status: Status;
}
