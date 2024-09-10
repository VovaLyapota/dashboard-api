import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

class AuthServiceMock {
  signup = jest.fn();
  signin = jest.fn();
  signout = jest.fn();
}

class UsersServiceMock {
  findOne = jest.fn();
}

describe('UsersController', () => {
  let controller: UsersController;
  let authServiceMock: AuthServiceMock;
  let usersServiceMock: UsersServiceMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        {
          provide: UsersService,
          useClass: UsersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    authServiceMock = module.get<AuthServiceMock>(AuthService);
    usersServiceMock = module.get<UsersServiceMock>(UsersService);
  });

  it('users controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createUser - returns created user by given email and password', async () => {
    const result = { id: 1, email: 'qweqwe@gmail.com' };
    authServiceMock.signup.mockResolvedValueOnce(result);

    const createdUser = await controller.createUser({
      email: 'qweqwe@gmail.com',
      password: 'qweqwe',
    });

    expect(createdUser).toEqual(result);
    expect(createdUser.email).toEqual('qweqwe@gmail.com');
    expect(authServiceMock.signup).toHaveBeenCalledWith(
      'qweqwe@gmail.com',
      'qweqwe',
    );
  });

  it('login - returns logged in user by given email and password', async () => {
    const result = { id: 1, email: 'qweqwe@gmail.com', token: 'token' };
    authServiceMock.signin.mockResolvedValueOnce(result);

    const loggedUser = await controller.login({
      email: 'qweqwe@gmail.com',
      password: 'qweqwe',
    });

    expect(loggedUser).toEqual(result);
    expect(loggedUser.email).toEqual('qweqwe@gmail.com');
    expect(authServiceMock.signin).toHaveBeenCalledWith(
      'qweqwe@gmail.com',
      'qweqwe',
    );
  });

  it('signout - calls service signout method and returns nothing with given user email', async () => {
    const res = await controller.logout({ email: 'qweqwe@gmail.com' } as User);

    expect(res).toBeUndefined();
    expect(authServiceMock.signout).toHaveBeenCalledWith('qweqwe@gmail.com');
  });

  it('getUser - returns user by given id', async () => {
    const res = { id: 1, email: 'qweqwe@gmail.com', token: 'token' };
    usersServiceMock.findOne.mockResolvedValueOnce(res);
    const foundUser = await controller.getUser('1');

    expect(foundUser).toEqual(res);
    expect(usersServiceMock.findOne).toHaveBeenCalledWith(1);
  });

  it('getUser - throws a BadRequestException if id is invalid', async () => {
    await expect(controller.getUser('invalid_id')).rejects.toThrow(
      BadRequestException,
    );
    expect(usersServiceMock.findOne).not.toHaveBeenCalled();
  });

  it('getUser - throws a NotFoundException if user not found', async () => {
    usersServiceMock.findOne.mockResolvedValue(null);

    await expect(controller.getUser('1')).rejects.toThrow(NotFoundException);
    expect(usersServiceMock.findOne).toHaveBeenCalled();
  });
});
