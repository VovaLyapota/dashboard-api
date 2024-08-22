import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const { currentUser } = context.switchToHttp().getRequest() || {};
    if (!currentUser?.id) return false;

    const user = await this.usersService.findOne(currentUser?.id);
    return !!(user && user.token && user.token === currentUser.token);
  }
}
