import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

class UsersServiceMok {
  create = jest.fn();
  find = jest.fn();
  update = jest.fn();
}
class JwtServiceMok {
  sign = jest.fn();
}

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMok: UsersServiceMok;
  let jwtServiceMok: JwtServiceMok;
  let user: {
    id: number;
    email: string;
    password: string;
    token: string | null;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useClass: JwtServiceMok },
        {
          provide: UsersService,
          useClass: UsersServiceMok,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersServiceMok = module.get<UsersServiceMok>(UsersService);
    jwtServiceMok = module.get<JwtServiceMok>(JwtService);
    user = {
      id: 1,
      email: 'qweqwe@gmail.com',
      password: 'qweqwe',
      token: 'token',
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signup - creates and returns a user with given email and password', async () => {
    usersServiceMok.find.mockResolvedValueOnce([]);
    usersServiceMok.create.mockResolvedValueOnce(user);
    usersServiceMok.update.mockResolvedValueOnce({ ...user, token: 'token' });
    jwtServiceMok.sign.mockReturnValue('token');

    const createdUser = await service.signup('qweqwe@gmail.com', 'qweqwe');

    expect(createdUser).toEqual({ ...user, token: 'token' });

    expect(usersServiceMok.find).toHaveBeenCalledWith(user.email);
    expect(usersServiceMok.create).toHaveBeenCalled();
    expect(jwtServiceMok.sign).toHaveBeenCalledWith({
      id: user.id,
      email: user.email,
    });
  });

  it('signup - throws a BadRequestException if there is user with given email', async () => {
    usersServiceMok.find.mockResolvedValueOnce([user]);

    await expect(service.signup(user.email, user.password)).rejects.toThrow(
      BadRequestException,
    );

    expect(usersServiceMok.create).not.toHaveBeenCalled();
    expect(jwtServiceMok.sign).not.toHaveBeenCalled();
    expect(usersServiceMok.update).not.toHaveBeenCalled();
  });

  it('signin - logs in user with given email and password', async () => {
    usersServiceMok.find.mockResolvedValueOnce([user]);
    usersServiceMok.update.mockResolvedValueOnce({
      ...user,
      token: 'token',
    });
    jwtServiceMok.sign.mockReturnValue('token');

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => true);
    const loggedUser = await service.signin(user.email, user.password);

    expect(loggedUser).toEqual({ ...user, token: 'token' });

    expect(usersServiceMok.find).toHaveBeenCalledWith(user.email);
    expect(jwtServiceMok.sign).toHaveBeenCalledWith({
      id: user.id,
      email: user.email,
    });
  });

  it('signin - throws a BadRequestException if there is no user with given email', async () => {
    usersServiceMok.find.mockResolvedValueOnce([]);

    await expect(service.signin('qweqwe@gmail.com', 'qweqwe')).rejects.toThrow(
      BadRequestException,
    );

    expect(jwtServiceMok.sign).not.toHaveBeenCalled();
    expect(usersServiceMok.update).not.toHaveBeenCalled();
    expect(usersServiceMok.update).not.toHaveBeenCalled();
  });

  it('signin - throws a ForbiddenException if invalid password was given', async () => {
    usersServiceMok.find.mockResolvedValueOnce([user]);

    await expect(service.signin(user.email, user.password)).rejects.toThrow(
      ForbiddenException,
    );

    expect(usersServiceMok.find).toHaveBeenCalled();
    expect(jwtServiceMok.sign).not.toHaveBeenCalled();
    expect(usersServiceMok.update).not.toHaveBeenCalled();
  });

  it('signout - removes token by given email', async () => {
    usersServiceMok.find.mockResolvedValueOnce([user]);

    const res = await service.signout(user.email);

    expect(res).toEqual(true);

    expect(usersServiceMok.update).toHaveBeenCalledWith(user.id, {
      token: null,
    });
  });

  it('signout - throws a BadRequestException if invalid email was given', async () => {
    usersServiceMok.find.mockResolvedValueOnce([]);

    await expect(service.signout('qweqwe@gmail.com')).rejects.toThrow(
      BadRequestException,
    );

    expect(usersServiceMok.update).not.toHaveBeenCalled();
  });
});
