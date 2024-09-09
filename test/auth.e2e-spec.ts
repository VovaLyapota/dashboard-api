import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/guards/auth.guard';

describe('Auth System (e2e)', () => {
  let app: INestApplication;
  let email = 'qweqwe@gmail.com';
  let password = 'qweqwe';
  let token = 'mockToken';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtService)
      .useValue({ sign: jest.fn().mockReturnValue(token) })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockResolvedValue(true) })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('signup - handles signup request and returns created user', async () => {
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

  it('signin - handles signin request and returns already existing user', async () => {
    const {
      body: { id, email: resEmail, token },
    } = await request(app.getHttpServer())
      .get('/users/signin')
      .send({
        email,
        password,
      })
      .expect(200);

    expect(resEmail).toEqual(email);
    expect(id).toBeDefined();
    expect(token).toBeDefined();
  });

  it('signout - handles signout request and deletes existing token in db', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/signout')
      .send({ email })
      .expect(204);

    const {
      body: { email: resEmail, token },
    } = await request(app.getHttpServer()).get('/users/1');

    expect(res).toBeNull();
    expect(resEmail).toEqual(email);
    expect(token).toBeNull();
  });
});
