import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './config/typeorm.config';
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
import { DashboardModule } from './dashboard/dashboard.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<string>('NODE_ENV') === 'production'
          ? { useClass: TypeOrmConfigService }
          : {
              type: 'sqlite',
              database: config.get<string>('DB_NAME'),
              entities: [User, Supplier, Product, Order, Customer],
              synchronize: true,
            },
    }),
    UsersModule,
    SuppliersModule,
    ProductsModule,
    OrdersModule,
    CustomersModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
