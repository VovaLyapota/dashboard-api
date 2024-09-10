import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/guards/auth.guard';
import * as request from 'supertest';

describe('Orders System (e2e)', () => {
  let app: INestApplication;
  let orderDto = {
    customerName: 'customer',
    address: 'address',
    quantity: 10,
    amount: 100,
    date: '01-01-2024',
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

  describe('createOrder (POST)', () => {
    it('should create and return new order by given dto', async () => {
      const { body: createdOrder } = await request(app.getHttpServer())
        .post('/orders')
        .send(orderDto)
        .expect(201);

      expect(createdOrder.id).toBeDefined();
      expect(createdOrder.customerName).toEqual(orderDto.customerName);
    });

    it('should throw 400 Bad Request if dto is invalid or undefined', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/orders')
        .expect(400);

      expect(body.message).toBeDefined();
    });
  });

  describe('getOrder (/:id, GET)', () => {
    it('should return order by given id', async () => {
      const { body: foundOrder } = await request(app.getHttpServer())
        .get('/orders/1')
        .expect(200);

      expect(foundOrder.id).toEqual(1);
    });

    it('should throw 400 Bad Request if id is invalid', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/orders/invalid_id')
        .expect(400);

      expect(body.message).toBeDefined();
    });

    it('should throw 404 Not Found if no order was found', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/orders/777')
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });

  describe('getOrders (GET)', () => {
    it('should return a list of orders by a query if such one exists', async () => {
      const { body: foundOrders } = await request(app.getHttpServer())
        .get('/orders?quantity=10&minAmount=99')
        .expect(200);

      expect(foundOrders.length).toBeGreaterThanOrEqual(1);
    });

    it('should throw 404 Not Found if no orders were found', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/orders?quantity=40&minAmount=777')
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });

  describe('updateOrder (/:id, PUT)', () => {
    it('should update and return updated order by given id and dto', async () => {
      const updateDto = { customerName: 'new customer name', amount: 120 };
      const { body: updatedOrder } = await request(app.getHttpServer())
        .put('/orders/1')
        .send(updateDto)
        .expect(200);

      expect(updatedOrder.id).toEqual(1);
      expect(updatedOrder.customerName).toEqual(updateDto.customerName);
      expect(updatedOrder.amount).toEqual(updateDto.amount);
    });

    it('should throw 400 Bad Request if id is invalid', async () => {
      const { body } = await request(app.getHttpServer())
        .put('/orders/invalid_id')
        .expect(400);

      expect(body.message).toBeDefined();
    });

    it('should throw 404 Not Found if no order with such an id', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/orders/777')
        .send({})
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });

  describe('deleteOrder (/:id, DELETE)', () => {
    it('should delete order by given id', async () => {
      await request(app.getHttpServer()).delete('/orders/1').expect(204);

      await request(app.getHttpServer()).get('/orders/1').expect(404);
    });

    it('should throw 400 Bad Request if id is invalid', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/orders/invalid_id')
        .expect(400);

      expect(body.message).toBeDefined();
    });

    it('should throw 404 Not Found if no order with such an id', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/orders/777')
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });
});
