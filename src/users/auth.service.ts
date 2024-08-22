import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length)
      throw new BadRequestException('User with this email already exists');

    const hashedPassword = await bcrypt.hash(password, 12);
    const { id } = await this.usersService.create(email, hashedPassword);

    const token = this.jwtService.sign({ userId: id, email });
    const user = await this.usersService.update(id, { token });

    return user;
  }
}
