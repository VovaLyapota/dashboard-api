import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersController } from './users.controller';

class AuthServiceMock {
  signup = jest.fn();
  signin = jest.fn();
  signout = jest.fn();
}

describe('UsersController', () => {
  let controller: UsersController;
  let authServiceMock: AuthServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: AuthService, useClass: AuthServiceMock }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    authServiceMock = module.get<AuthServiceMock>(AuthService);
  });

  it('users controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createUser - returns created user by given email and password', async () => {
    const dto: CreateUserDto = {
      email: 'qweqwe@gmail.com',
      password: 'qweqwe',
    };
    const result = { id: 1, email: 'qweqwe@gmail.com' };
    authServiceMock.signup.mockResolvedValueOnce(result);

    const createdUser = await controller.createUser(dto);

    expect(createdUser).toEqual(result);
    expect(createdUser.email).toEqual(dto.email);
    expect(authServiceMock.signup).toHaveBeenCalledWith(
      dto.email,
      dto.password,
    );
  });

  it('login - returns logged in user by given email and password', async () => {
    const dto: CreateUserDto = {
      email: 'qweqwe@gmail.com',
      password: 'qweqwe',
    };
    const result = { id: 1, email: 'qweqwe@gmail.com', token: 'token' };
    authServiceMock.signin.mockResolvedValueOnce(result);

    const loggedUser = await controller.login(dto);

    expect(loggedUser).toEqual(result);
    expect(loggedUser.email).toEqual(dto.email);
    expect(authServiceMock.signin).toHaveBeenCalledWith(
      dto.email,
      dto.password,
    );
  });

  it('signout - calls service signout method and returns nothing with given user email', async () => {
    // @ts-expect-error we don't need to use user entity here to mock because of one value
    const res = await controller.logout({ email: 'qweqwe@gmail.com' });

    expect(res).toBeUndefined();
    expect(authServiceMock.signout).toHaveBeenCalledWith('qweqwe@gmail.com');
  });
});
