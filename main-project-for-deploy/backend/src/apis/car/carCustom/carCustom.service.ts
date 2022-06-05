import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CarModel } from '../carModel/entities/carModel.entity';
import { CarWheel } from '../carWheel/entities/carWheel.entity';
import { CarCustom } from './entities/carCustom.entity';

@Injectable()
export class CarCustomService {
    constructor(
        @InjectRepository(CarCustom)
        private readonly carCustomRepository: Repository<CarCustom>,
        @InjectRepository(CarWheel)
        private readonly carWheelRepository: Repository<CarWheel>,

        @InjectRepository(CarModel)
        private readonly carModelRepository: Repository<CarModel>,
    ) {}
    async findAll() {
        const result = await this.carCustomRepository.find({
            relations: ['carModel', 'carWheel'],
            withDeleted: true,
        });

        return result;
    }

    async findOne({ carCustomId }) {
        const result = await this.carCustomRepository.findOne({
            where: { id: carCustomId },
            relations: ['carModel', 'carWheel'],
            withDeleted: true,
        });

        return result;
    }

    async create({ createCarCustomInput }) {
        const { createCarWheelInput, carModelId, ...detail } =
            createCarCustomInput;

        const wheelResult = await this.carWheelRepository.save({
            ...createCarWheelInput,
        });

        const modelResult = await this.carModelRepository.findOne({
            where: {
                id: carModelId,
            },
        });
        if (!modelResult)
            throw new UnprocessableEntityException('잘못된 모델정보입니다');

        return await this.carCustomRepository.save({
            ...detail,
            carModel: modelResult,
            carWheel: wheelResult,
        });
    }

    async update({ carCustomId, updateCarCustomInput }) {
        const carCustom = await this.carCustomRepository.findOne({
            where: {
                id: carCustomId,
            },
        });
        const newCarCustom = {
            ...carCustom,
            ...updateCarCustomInput,
        };
        return await this.carCustomRepository.save(newCarCustom);
    }

    async delete({ carCustomId }) {
        const result = await this.carCustomRepository.softDelete({
            id: carCustomId,
        }); // 다양한 조건으로 삭제가능!!
        return result.affected ? true : false;
    }

    async restore({ carCustomId }) {
        const result = await this.carCustomRepository.restore({
            id: carCustomId,
        });
        return result.affected ? true : false;
    }
}
