import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/guards/auth.guard';
import * as request from 'supertest';

describe('Customers System (e2e)', () => {
  let app: INestApplication;
  let customerDto = {
    name: 'customer',
    email: 'qweqwe@gmail.com',
    spent: 1200,
    phone: '+380703703703',
    address: 'address',
    registeredAt: '01-01-2024',
  };

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

  describe('createCustomer (POST)', () => {
    it('should create and return new customer by given dto', async () => {
      const { body: createdCustomer } = await request(app.getHttpServer())
        .post('/customers')
        .send(customerDto)
        .expect(201);

      expect(createdCustomer.id).toBeDefined();
      expect(createdCustomer.name).toEqual(customerDto.name);
    });

    it('should throw 400 Bad Request if dto is invalid or undefined', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/customers')
        .expect(400);

      expect(body.message).toBeDefined();
    });
  });

  describe('getCustomer (/:id, GET)', () => {
    it('should return customer by given id', async () => {
      const { body: foundCustomer } = await request(app.getHttpServer())
        .get('/customers/1')
        .expect(200);

      expect(foundCustomer.id).toEqual(1);
    });

    it('should throw 400 Bad Request if id is invalid', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/customers/invalid_id')
        .expect(400);

      expect(body.message).toBeDefined();
    });

    it('should throw 404 Not Found if no customer was found', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/customers/777')
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });

  describe('getCustomers (GET)', () => {
    it('should return a list of customers by a query if such one exists', async () => {
      const { body: foundCustomers } = await request(app.getHttpServer())
        .get('/customers?name=cus&minSpent=1000')
        .expect(200);

      expect(foundCustomers.length).toBeGreaterThanOrEqual(1);
    });

    it('should throw 404 Not Found if no customers were found', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/customers?name=bad&minSpent=1500')
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });

  describe('updateCustomer (/:id, PUT)', () => {
    it('should update and return updated customer by given id and dto', async () => {
      const updateDto = { name: 'new customer name', spent: 1450 };
      const { body: updatedCustomer } = await request(app.getHttpServer())
        .put('/customers/1')
        .send(updateDto)
        .expect(200);

      expect(updatedCustomer.id).toEqual(1);
      expect(updatedCustomer.name).toEqual(updateDto.name);
      expect(updatedCustomer.spent).toEqual(updateDto.spent);
    });

    it('should throw 400 Bad Request if id is invalid', async () => {
      const { body } = await request(app.getHttpServer())
        .put('/customers/invalid_id')
        .expect(400);

      expect(body.message).toBeDefined();
    });

    it('should throw 404 Not Found if no customer with such an id', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/customers/777')
        .send({})
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });

  describe('deleteCustomer (/:id, DELETE)', () => {
    it('should delete customer by given id', async () => {
      await request(app.getHttpServer()).delete('/customers/1').expect(204);

      await request(app.getHttpServer()).get('/customers/1').expect(404);
    });

    it('should throw 400 Bad Request if id is invalid', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/customers/invalid_id')
        .expect(400);

      expect(body.message).toBeDefined();
    });

    it('should throw 404 Not Found if no customer with such an id', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/customers/777')
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });
});
