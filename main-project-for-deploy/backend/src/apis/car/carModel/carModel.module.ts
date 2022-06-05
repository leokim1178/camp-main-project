import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModel } from './entities/carModel.entity';
import { CarModelResolver } from './carModel.resolver';
import { CarModelService } from './carModel.service';
import { CarTag } from '../carTag/entities/carTag.entity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CarModel, //
            CarTag,
        ]),
        ElasticsearchModule.register({
            node: 'http://elasticsearch:9200', //node는 컴퓨터라는 뜻
        }),
    ],
    providers: [
        CarModelService, //여기에 의존성 주입
        CarModelResolver,
    ],
})
export class CarModelModule {}
