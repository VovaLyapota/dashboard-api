import {
  ExecutionContext,
  INestApplication,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/guards/auth.guard';
import * as request from 'supertest';

class AuthGuardMock {
  canActivate = jest.fn().mockImplementation((context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    req.currentUser = {
      id: 1,
      email: 'qweqwe@gmail.com',
    };

    return true;
  });
}

describe('Auth System (e2e)', () => {
  let app: INestApplication;
  let authGuardMock: AuthGuardMock;
  const email = 'qweqwe@gmail.com';
  const password = 'qweqwe';
  const token = 'mockToken';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtService)
      .useValue({ sign: jest.fn().mockReturnValue(token) })
      .overrideProvider(AuthGuard)
      .useClass(AuthGuardMock)
      .compile();

    app = moduleFixture.createNestApplication();
    authGuardMock = moduleFixture.get<AuthGuardMock>(AuthGuard);
    await app.init();
  });

  describe('createUser (/signup, POST)', () => {
    it('should return created user', async () => {
      const {
        body: { id, email: resEmail, token },
      } = await request(app.getHttpServer())
        .post('/users/signup')
        .send({ email, password })
        .expect(201);

      expect(id).toBeDefined();
      expect(token).toBeDefined();
      expect(resEmail).toEqual(email);
    });

    it('should throw 400 Bad Request if given credentials is invalid or undefined', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/users/signup')
        .expect(400);

      expect(body.message).toBeDefined();
    });

    it('should throw 400 Bad Request if user with such an email already exists', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/users/signup')
        .send({ email, password })
        .expect(400);

      expect(body.message).toBeDefined();
    });
  });

  describe('login (/signin, GET)', () => {
    it('should return already existing user', async () => {
      const {
        body: { id, email: resEmail, token },
      } = await request(app.getHttpServer())
        .get('/users/signin')
        .send({ email, password })
        .expect(200);

      expect(resEmail).toEqual(email);
      expect(id).toBeDefined();
      expect(token).toBeDefined();
    });

    it('should throw 400 Bad Request if given email or password is invalid', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users/signin')
        .send({ email: 'invalid_email', password: 'short' })
        .expect(400);

      expect(body.message).toBeDefined();
    });

    it('should throw 403 Forbidden if given password is invalid', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users/signin')
        .send({
          email,
          password: 'invalid_password',
        })
        .expect(403);

      expect(body.message).toBeDefined();
    });
  });

  describe('logout (/signout, POST)', () => {
    it('should handle request and delete existing token in db', async () => {
      await request(app.getHttpServer())
        .post('/users/signout')
        .send({ email })
        .expect(204);

      const {
        body: { email: resEmail, token },
      } = await request(app.getHttpServer()).get('/users/1');

      expect(resEmail).toEqual(email);
      expect(token).toBeNull();
    });

    it('should throw 401 Unauthorized if given token is invalid or undefined', async () => {
      authGuardMock.canActivate.mockImplementationOnce(() => {
        throw new UnauthorizedException();
      });

      const { body } = await request(app.getHttpServer())
        .post('/users/signout')
        .send({ email })
        .expect(401);

      expect(body.message).toBeDefined();
    });
  });

  describe('getCurrentUser (/whoami, GET)', () => {
    it('should return current user', async () => {
      const { body: currentUser } = await request(app.getHttpServer())
        .get('/users/whoami')
        .expect(200);

      expect(currentUser).toBeDefined();
      expect(currentUser.email).toEqual(email);
    });

    it('should throw 401 Unauthorized if given token is invalid or undefined', async () => {
      authGuardMock.canActivate.mockImplementationOnce(() => {
        throw new UnauthorizedException();
      });

      const { body } = await request(app.getHttpServer())
        .get('/users/whoami')
        .expect(401);

      expect(body.message).toBeDefined();
    });
  });
});
