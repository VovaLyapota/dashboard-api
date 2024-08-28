import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Public } from 'src/decorators/public-route.decorator';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  @Public()
  @Get('signin')
  login(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signout')
  async logout(@CurrentUser() user: User) {
    await this.authService.signout(user.email);
  }

  @Get('whoami')
  async getCurrentUser(@CurrentUser() user: User) {
    return user;
  }
}
