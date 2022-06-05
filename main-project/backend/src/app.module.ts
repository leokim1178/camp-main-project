import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarModelModule } from './apis/car/carModel/carModel.module';
import { CarTypeModule } from './apis/car/carType/carType.module';
import { CarCustomModule } from './apis/car/carCustom/carCustom.module';
import { CarImgModule } from './apis/car/carImg/carImg.module';

import { UserModule } from './apis/user/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { PaymentModule } from './apis/payment/payment.module';

import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

import { AppController } from './apis/app.controller';
import { AppService } from './apis/app.service';
import { TestModule } from './apis/test/test.module';

@Module({
  imports: [
    CarModelModule,
    CarCustomModule,
    CarTypeModule,
    CarImgModule,
    //==========CarModules=======//
    AuthModule,
    PaymentModule,
    UserModule,
    TestModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/commons/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '10.22.177.4',
      port: 3306,
      username: 'root',
      password: '1178',
      database: 'my-database',
      entities: [__dirname + '/apis/**/**/*.entity.*'],
      synchronize: true,
      logging: true,
      retryAttempts: 30,
      retryDelay: 5000,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://10.22.176.3:6379',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
