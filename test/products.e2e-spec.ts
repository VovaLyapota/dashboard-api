import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { AuthGuard } from 'src/guards/auth.guard';
import * as request from 'supertest';

describe('Products System (e2e)', () => {
  let app: INestApplication;
  let productDto = {
    name: 'product',
    stock: 10,
    price: 35,
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

  describe('createProduct (POST)', () => {
    it('should create and return new product by given dto', async () => {
      const { body: createdProduct } = await request(app.getHttpServer())
        .post('/products')
        .send(productDto)
        .expect(201);

      expect(createdProduct.id).toBeDefined();
      expect(createdProduct.name).toEqual(productDto.name);
    });

    it('should throw 400 Bad Request if dto is invalid or undefined', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/products')
        .expect(400);

      expect(body.message).toBeDefined();
    });
  });

  describe('getOneProduct (/:id, GET)', () => {
    it('should return product by given id', async () => {
      const { body: foundProduct } = await request(app.getHttpServer())
        .get('/products/1')
        .expect(200);

      expect(foundProduct.id).toEqual(1);
    });

    it('should throw 400 Bad Request if id is invalid', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/products/invalid_id')
        .expect(400);

      expect(body.message).toBeDefined();
    });

    it('should throw 404 Not Found if no product was found', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/products/777')
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });

  describe('getProducts (GET)', () => {
    it('should return a list of products by a query if such one exists', async () => {
      const { body: foundProducts } = await request(app.getHttpServer())
        .get('/products?stock=10&minPrice=33')
        .expect(200);

      expect(foundProducts.length).toBeGreaterThanOrEqual(1);
    });

    it('should throw 404 Not Found if no products were found', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/products?stock=30&minPrice=36')
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });

  describe('updateProduct (/:id, PUT)', () => {
    it('should update and return updated product by given id and dto', async () => {
      const updateDto = { name: 'new product', stock: 50 };
      const { body: updatedProduct } = await request(app.getHttpServer())
        .put('/products/1')
        .send(updateDto)
        .expect(200);

      expect(updatedProduct.id).toEqual(1);
      expect(updatedProduct.name).toEqual(updateDto.name);
      expect(updatedProduct.stock).toEqual(updateDto.stock);
    });

    it('should throw 400 Bad Request if id is invalid', async () => {
      const { body } = await request(app.getHttpServer())
        .put('/products/invalid_id')
        .expect(400);

      expect(body.message).toBeDefined();
    });

    it('should throw 404 Not Found if no product with such an id', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/products/777')
        .send({})
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });

  describe('deleteProduct (/:id, DELETE)', () => {
    it('should delete product by given id', async () => {
      await request(app.getHttpServer()).delete('/products/1').expect(204);

      await request(app.getHttpServer()).get('/products/1').expect(404);
    });

    it('should throw 400 Bad Request if id is invalid', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/products/invalid_id')
        .expect(400);

      expect(body.message).toBeDefined();
    });

    it('should throw 404 Not Found if no product with such an id', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/products/777')
        .expect(404);

      expect(body.message).toBeDefined();
    });
  });
});
