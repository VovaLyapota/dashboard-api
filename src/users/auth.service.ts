import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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

    const token = this.jwtService.sign({ id, email });
    const user = await this.usersService.update(id, { token });

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user)
      throw new BadRequestException('There is no any users with such an email');

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new ForbiddenException('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id, email });
    const updatedUser = await this.usersService.update(user.id, { token });

    return updatedUser;
  }

  async signout(email: string) {
    const [user] = await this.usersService.find(email);
    if (!user)
      throw new BadRequestException('There is no any users with such an email');

    await this.usersService.update(user.id, { token: null });

    return true;
  }
}
