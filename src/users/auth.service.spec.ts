import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersServiceMok: UsersService;
  let jwtServiceMok: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: {} },
        { provide: UsersService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersServiceMok = module.get<UsersService>(UsersService);
    jwtServiceMok = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
