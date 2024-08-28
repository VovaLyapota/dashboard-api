import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OrderStatusEnum {
  COMPLETED = 'Completed',
  CONFIRMED = 'Confirmed',
  PENDING = 'Pending',
  CANCELLED = 'Cancelled',
  PROCESSING = 'Processing',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  address: string;

  @Column()
  quantity: number;

  @Column({
    type: 'float',
  })
  amount: number;

  // @Column({
  //   type: 'enum',
  //   enum: OrderStatusEnum,
  //   default: OrderStatusEnum.PENDING,
  // })
  // status: OrderStatusEnum;
  @Column({ default: OrderStatusEnum.PENDING })
  status: `${OrderStatusEnum}`;

  @Column()
  date: string;

  @AfterInsert()
  logInsert() {
    console.log('Inserted new order with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Order with id ', this.id, ' was updated');
  }

  @AfterRemove()
  logRemove() {
    console.log('Order with id ', this.id, ' was deleted');
  }
}
