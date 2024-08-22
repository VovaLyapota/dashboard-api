import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.usersRepo.create({ email, password });

    return this.usersRepo.save(user);
  }

  findOne(id: number) {
    if (!id) return null;

    return this.usersRepo.findBy({ id });
  }

  find(email: string) {
    return this.usersRepo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const [user] = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, attrs);
    return this.usersRepo.save(user);
  }
}
