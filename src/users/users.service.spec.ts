import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

class UsersRepoMock {
  find = jest.fn();
  findOneBy = jest.fn();
  create = jest.fn();
  save = jest.fn();
}

describe('UsersService', () => {
  let service: UsersService;
  let usersRepoMok: UsersRepoMock;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: UsersRepoMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepoMok = module.get<UsersRepoMock>(getRepositoryToken(User));
    user = { email: 'email' } as User;
  });

  it('users service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return user with given email and password', async () => {
      usersRepoMok.create.mockReturnValueOnce(user);
      usersRepoMok.save.mockResolvedValueOnce(user);
      const createdUser = await service.create('email', 'pass');

      expect(createdUser).toEqual(user);
      expect(usersRepoMok.create).toHaveBeenCalledWith({
        email: 'email',
        password: 'pass',
      });
      expect(usersRepoMok.save).toHaveBeenCalledWith(user);
    });
  });

  describe('findOne', () => {
    it('should return user by given id', async () => {
      usersRepoMok.findOneBy.mockResolvedValueOnce(user);
      const foundUser = await service.findOne(1);

      expect(usersRepoMok.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(foundUser).toEqual(user);
    });

    it('should return null if no user is found', async () => {
      usersRepoMok.findOneBy.mockResolvedValueOnce(null);
      const result = await service.findOne(1);

      expect(result).toBeNull();
    });
  });

  describe('find', () => {
    it('should return users by given email', async () => {
      usersRepoMok.find.mockResolvedValueOnce([user]);
      const foundUsers = await service.find('email');

      expect(usersRepoMok.find).toHaveBeenCalledWith({
        where: { email: 'email' },
      });
      expect(foundUsers).toEqual([user]);
    });

    it('should return empty array if no users are found', async () => {
      usersRepoMok.find.mockResolvedValueOnce([]);
      const result = await service.find('email');

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update and return user with given updateDto', async () => {
      const updatedAttrs = { email: 'newqweqwe@gmail.com' };
      usersRepoMok.findOneBy.mockResolvedValueOnce(user);
      usersRepoMok.save.mockResolvedValueOnce({ ...user, ...updatedAttrs });

      const result = await service.update(1, updatedAttrs);

      expect(usersRepoMok.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(usersRepoMok.save).toHaveBeenCalledWith({
        ...user,
        ...updatedAttrs,
      });
      expect(result).toEqual({ ...user, ...updatedAttrs });
    });

    it('should throw a NotFoundException if the user is not found', async () => {
      usersRepoMok.findOneBy.mockResolvedValueOnce(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
      expect(usersRepoMok.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(usersRepoMok.save).not.toHaveBeenCalled();
    });
  });
});
