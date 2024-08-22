import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.usersService.create(body.email, body.password);

    return user;
  }
}
