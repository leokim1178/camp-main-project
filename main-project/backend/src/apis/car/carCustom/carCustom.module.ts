import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModel } from '../carModel/entities/carModel.entity';
import { CarWheel } from '../carWheel/entities/carWheel.entity';
import { CarCustomResolver } from './carCustom.resolver';
import { CarCustomService } from './carCustom.service';
import { CarCustom } from './entities/carCustom.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CarModel,
            CarCustom, //
            CarWheel,
        ]),
        ElasticsearchModule.register({
            node: 'http://elasticsearch:9200',
        }),
    ],
    providers: [
        CarCustomResolver, //
        CarCustomService,
    ],
})
export class CarCustomModule {}
