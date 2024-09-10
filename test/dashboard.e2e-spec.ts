import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/guards/auth.guard';
import * as request from 'supertest';

describe('Dashboard System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthGuard)
      .useValue({ canActivate: jest.fn().mockResolvedValue(true) })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('getDashboard (GET)', () => {
    it('should return dashboard data', async () => {
      const { body: dashboard } = await request(app.getHttpServer())
        .get('/dashboard')
        .expect(200);

      expect(dashboard).toEqual({ products: 0, suppliers: 0, customers: 0 });
    });
  });
});
