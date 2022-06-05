import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CarCustomService } from './carCustom.service';
import { CreateCarCustomInput } from './dto/createCarCustomInput';
import { UpdateCarCustomInput } from './dto/updateCarCustomInput';
import { CarCustom } from './entities/carCustom.entity';

@Resolver()
export class CarCustomResolver {
    constructor(
        private readonly carCustomService: CarCustomService,
        private readonly elasticsearchService: ElasticsearchService,
    ) {}

    @Query(() => [CarCustom])
    fetchCarCustoms() {
        //elasticsearch에서 검색하는 법
        // this.elasticsearchService.search({
        //     index: 'carCustom',
        //     query: {
        //         match_all: {},
        //     },
        // });
        return this.carCustomService.findAll();
    }

    @Query(() => CarCustom)
    fetchCarCustom(
        @Args('carCustomId')
        carCustomId: string,
    ) {
        return this.carCustomService.findOne({ carCustomId });
    }

    @Mutation(() => CarCustom)
    createCarCustom(
        @Args('createCarCustomInput')
        createCarCustomInput: CreateCarCustomInput,
    ) {
        //elasticsearch에 주입하는 방법
        // this.elasticsearchService.create({
        //     id: 'myid',
        //     index: 'CarCustom', //table 이름을 의미
        //     document: {
        //         ...createCarCustomInput,
        //     },
        // });
        return this.carCustomService.create({ createCarCustomInput });
    }

    @Mutation(() => CarCustom)
    updateCarCustom(
        @Args('carCustomId')
        carCustomId: string, //
        @Args('updateCarCustomInput')
        updateCarCustomInput: UpdateCarCustomInput, //
    ) {
        return this.carCustomService.update({
            carCustomId,
            updateCarCustomInput,
        });
    }

    @Mutation(() => Boolean)
    deleteCarCustom(
        @Args('carCustomId')
        carCustomId: string,
    ) {
        return this.carCustomService.delete({ carCustomId });
    }

    @Mutation(() => Boolean)
    restoreCarCustom(
        @Args('carCustomId')
        carCustomId: string,
    ) {
        return this.carCustomService.restore({ carCustomId });
    }
}
