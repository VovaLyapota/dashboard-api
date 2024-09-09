import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import * as request from 'supertest';

describe('Auth System (e2e)', () => {
  let app: INestApplication;
  let suppliersService: SuppliersService;
  let supplierDto = {
    name: 'supplier',
    address: 'address',
    company: 'company',
    date: '19-07-2023',
    amount: 100,
    status: 'Active',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthGuard)
      .useValue({ canActivate: jest.fn().mockResolvedValue(true) })
      .compile();

    app = moduleFixture.createNestApplication();
    suppliersService = moduleFixture.get<SuppliersService>(SuppliersService);
    await app.init();
  });

  describe('createSupplier (POST)', () => {
    it('should return new supplier', async () => {
      const { body: supplier } = await request(app.getHttpServer())
        .post('/suppliers')
        .send(supplierDto)
        .expect(201);

      expect(supplier.id).toBeDefined();
    });

    it('should throw 400 Bad Request if invalid dto was given or undefined', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/suppliers')
        .expect(400);

      expect(body.message).toBeDefined();
    });
  });

  describe('getAllSuppliers (GET)', () => {
    it('should return a list of found suppliers', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/suppliers')
        .expect(200);

      expect(body.length).toBeGreaterThanOrEqual(1);
    });

    it('should throw 404 Not Found if no suppliers was found', async () => {
      jest.spyOn(suppliersService, 'findAll').mockResolvedValueOnce([]);

      const { body } = await request(app.getHttpServer())
        .get('/suppliers')
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });

  describe('updateSupplier (/:id, PATCH)', () => {
    it('should return updated supplier', async () => {
      const { body } = await request(app.getHttpServer())
        .patch('/suppliers/1')
        .send({ amount: 123, status: 'Inactive' })
        .expect(200);

      expect(body.amount).not.toEqual(supplierDto.amount);
      expect(body.status).not.toEqual(supplierDto.status);
    });

    it('should throw 400 Bad Request if invalid id was given', async () => {
      const { body } = await request(app.getHttpServer())
        .patch('/suppliers/invalid_id')
        .expect(400);

      expect(body.message).toBeDefined();
    });

    it('should throw 404 Not Found if no supplier with such an id', async () => {
      const { body } = await request(app.getHttpServer())
        .patch('/suppliers/777')
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });
});
