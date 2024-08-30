import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  image: string | null;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'float',
  })
  spent: number;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  registeredAt: string;
}
