import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateCarModelInput } from './dto/createCarModelInput';
import { UpdateCarModelInput } from './dto/updateCarModelInput';
import { CarModel } from './entities/carModel.entity';
import { CarModelService } from './carModel.service';

@Resolver()
export class CarModelResolver {
    constructor(private readonly carModelService: CarModelService) {}

    @Query(() => [CarModel])
    fetchCarModels() {
        return this.carModelService.findAll();
    }
    @Query(() => CarModel)
    fetchCarModel(
        @Args('carModelId')
        carModelId: string,
    ) {
        return this.carModelService.findOne({ carModelId });
    }

    @Mutation(() => CarModel)
    createCarModel(
        @Args('createCarModelInput')
        createCarModelInput: CreateCarModelInput,
    ) {
        return this.carModelService.create({ createCarModelInput });
    }
    @Mutation(() => CarModel)
    async updateCarModel(
        @Args('carModelId')
        carModelId: string, //
        @Args('updateCarModelInput')
        updateCarModelInput: UpdateCarModelInput,
    ) {
        return await this.carModelService.update({
            carModelId,
            updateCarModelInput,
        }); //
    }

    @Mutation(() => Boolean)
    deleteCarModel(
        @Args('carModelId')
        carModelId: string,
    ) {
        return this.carModelService.delete({ carModelId });
    }

    @Mutation(() => Boolean)
    restoreCarModel(
        @Args('carModelId')
        carModelId: string,
    ) {
        return this.carModelService.restore({ carModelId });
    }
}
