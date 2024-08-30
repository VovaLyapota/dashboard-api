import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { TypeOrmConfigService } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { SuppliersModule } from './suppliers/suppliers.module';
import { Supplier } from './suppliers/supplier.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './products/product.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/order.entity';
import { CustomersModule } from './customers/customers.module';
import { Customer } from './customers/customer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Supplier, Product, Order, Customer],
      synchronize: true,
    }),
    UsersModule,
    SuppliersModule,
    ProductsModule,
    OrdersModule,
    CustomersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
