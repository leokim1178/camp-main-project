import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CarImgService } from './carImg.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CarImg } from './entities/carImg.entity';

@Resolver()
export class CarImgResolver {
    constructor(private readonly carImgService: CarImgService) {}

    @Mutation(() => [String])
    uploadImg(
        @Args({ name: 'imgs', type: () => [GraphQLUpload] })
        imgs: FileUpload[],
    ) {
        return this.carImgService.upload({ imgs });
    }

    @Mutation(() => [CarImg])
    createCarImgs(
        @Args('carCustomId')
        carCustomId: string,
        @Args({ name: 'imgURLs', type: () => [String] })
        imgURLs: string[],
    ) {
        return this.carImgService.create({ carCustomId, imgURLs });
    }

    @Mutation(() => [CarImg])
    updateCarImgs(
        @Args('carCustomId')
        carCustomId: string,
        @Args({ name: 'imgURLs', type: () => [String] })
        imgURLs: string[],
    ) {
        return this.carImgService.updateImg({ carCustomId, imgURLs });
    }
}
