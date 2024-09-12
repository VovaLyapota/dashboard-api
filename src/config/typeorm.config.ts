import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    const executionType = process.env.NODE_ENV;
    console.log('EXECUTION TYPE ', executionType);
    console.log('EXECUTION TYPE FIXED (?)', this.configService.get('NODE_ENV'));

    const dbConfig: Partial<TypeOrmModuleOptions> = {
      type: 'sqlite',
      synchronize: false,
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
    };

    if (executionType === 'test')
      Object.assign(dbConfig, {
        migrationsRun: true,
        migrations: ['src/migrations/*.ts'],
      });

    if (executionType === 'production')
      Object.assign(dbConfig, {
        type: 'postgres',
        host: process.env.PGHOST,
        port: +process.env.PGPORT,
        username: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        migrationsRun: true,
        migrations: ['src/migrations/*.ts'],
        synchronize: false,
        autoLoadEntities: true,
        ssl: {
          rejectUnauthorized: false,
        },
      });

    return dbConfig;
  }
}
