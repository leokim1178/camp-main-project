import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarType } from './entities/carType.entity';
import { CarTypeResolver } from './carType.resolver';
import { CarTypeService } from './carType.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
    imports: [
        TypeOrmModule.forFeature([CarType]),
        ElasticsearchModule.register({
            node: 'http://elasticsearch:9200', //node는 컴퓨터라는 뜻
        }),
    ],
    providers: [
        CarTypeService, //여기에 의존성 주입
        CarTypeResolver,
    ],
})
export class CarTypeModule {}
