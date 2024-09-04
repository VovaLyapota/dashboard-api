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
  });

  it('users service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create - creates and returns user with given email and password', async () => {
    const user = new User();
    user.email = 'qweqwe@gmail.com';

    usersRepoMok.save.mockResolvedValueOnce(user);
    const createdUser = await service.create('qweqwe@gmail.com', 'qweqwe');

    expect(usersRepoMok.create).toHaveBeenCalledWith({
      email: 'qweqwe@gmail.com',
      password: 'qweqwe',
    });

    expect(createdUser).toEqual(user);
  });

  it('findOne - returns user by given id', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'qweqwe@gmail.com';

    usersRepoMok.findOneBy.mockResolvedValueOnce(user);
    const foundUser = await service.findOne(1);

    expect(usersRepoMok.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(foundUser).toEqual(user);
  });

  it('findOne - returns null if no user is found', async () => {
    usersRepoMok.findOneBy.mockResolvedValueOnce(null);
    const result = await service.findOne(1);
    expect(result).toBeNull();
  });

  it('find - returns users by given email', async () => {
    const user = new User();
    user.email = 'qweqwe@gmail.com';

    usersRepoMok.find.mockResolvedValueOnce([user]);
    const foundUsers = await service.find('qweqwe@gmail.com');

    expect(usersRepoMok.find).toHaveBeenCalledWith({
      where: { email: 'qweqwe@gmail.com' },
    });
    expect(foundUsers).toEqual([user]);
  });

  it('find - returns empty array if no users are found', async () => {
    usersRepoMok.find.mockResolvedValueOnce([]);
    const result = await service.find('nonexistent@gmail.com');
    expect(result).toEqual([]);
  });

  it('update - updates and returns user with given options', async () => {
    const user = new User();
    user.id = 1;
    user.email = 'qweqwe@gmail.com';
    user.password = 'qweqwe';

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

  it('update - throw a NotFoundException if the user is not found', async () => {
    usersRepoMok.findOneBy.mockResolvedValueOnce(null);

    await expect(
      service.update(1, { email: 'qweqwe@gmail.com' }),
    ).rejects.toThrow(NotFoundException);

    expect(usersRepoMok.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(usersRepoMok.save).not.toHaveBeenCalled();
  });
});
