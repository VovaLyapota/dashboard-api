import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

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
  let user: User;

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
    user = { email: 'email' } as User;
  });

  it('auth service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should create and return a user with given email and password', async () => {
      usersServiceMok.find.mockResolvedValueOnce([]);
      usersServiceMok.create.mockResolvedValueOnce(user);
      usersServiceMok.update.mockResolvedValueOnce({ ...user, token: 'token' });
      jwtServiceMok.sign.mockReturnValue('token');
      const createdUser = await service.signup('email', 'pass');

      expect(createdUser).toEqual({ ...user, token: 'token' });
      expect(usersServiceMok.find).toHaveBeenCalledWith(user.email);
      expect(usersServiceMok.create).toHaveBeenCalled();
      expect(jwtServiceMok.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
      });
    });

    it('should throw BadRequestException if a user with the given email already exists', async () => {
      usersServiceMok.find.mockResolvedValueOnce([user]);

      await expect(service.signup('email', 'pass')).rejects.toThrow(
        BadRequestException,
      );
      expect(usersServiceMok.create).not.toHaveBeenCalled();
      expect(jwtServiceMok.sign).not.toHaveBeenCalled();
      expect(usersServiceMok.update).not.toHaveBeenCalled();
    });
  });

  describe('signin', () => {
    it('should login a user with the given email and password', async () => {
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

    it('should throw BadRequestException if no user is found with the given email', async () => {
      usersServiceMok.find.mockResolvedValueOnce([]);

      await expect(service.signin('email', 'pass')).rejects.toThrow(
        BadRequestException,
      );
      expect(jwtServiceMok.sign).not.toHaveBeenCalled();
      expect(usersServiceMok.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if the wrong password is given', async () => {
      usersServiceMok.find.mockResolvedValueOnce([user]);
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => false);

      await expect(service.signin('email', 'pass')).rejects.toThrow(
        ForbiddenException,
      );
      expect(usersServiceMok.find).toHaveBeenCalled();
      expect(jwtServiceMok.sign).not.toHaveBeenCalled();
      expect(usersServiceMok.update).not.toHaveBeenCalled();
    });
  });

  describe('signout', () => {
    it('should remove token by the given email', async () => {
      usersServiceMok.find.mockResolvedValueOnce([user]);
      const res = await service.signout(user.email);

      expect(res).toEqual(true);
      expect(usersServiceMok.update).toHaveBeenCalledWith(user.id, {
        token: null,
      });
    });

    it('should throw BadRequestException if no user is found with the given email', async () => {
      usersServiceMok.find.mockResolvedValueOnce([]);

      await expect(service.signout('email')).rejects.toThrow(
        BadRequestException,
      );
      expect(usersServiceMok.update).not.toHaveBeenCalled();
    });
  });
});
