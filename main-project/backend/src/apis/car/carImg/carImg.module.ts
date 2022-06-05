import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarCustom } from '../carCustom/entities/carCustom.entity';

import { CarImgResolver } from './carImg.resolver';
import { CarImgService } from './carImg.service';
import { CarImg } from './entities/carImg.entity';

@Module({
    imports: [TypeOrmModule.forFeature([CarImg, CarCustom])],
    providers: [CarImgResolver, CarImgService],
})
export class CarImgModule {}
