import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CarType } from './entities/carType.entity';
import { CarTypeService } from './carType.service';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Resolver()
export class CarTypeResolver {
    constructor(
        private readonly carTypeService: CarTypeService,
        @Inject(CACHE_MANAGER)
        private readonly cachManager: Cache,
        private readonly elasticsearchService: ElasticsearchService,
        @InjectRepository(CarType)
        private readonly carTypeRepository: Repository<CarType>,
    ) {}

    @Query(() => [CarType])
    async fetchCarType(
        @Args('search')
        search: string,
    ) {
        //1. redis에 검색값이 존재하는지 확인
        const checkRedis = await this.cachManager.get(search);

        //2. redis 값이 존재하면 redis에서 데이터를 추출해 전송
        if (checkRedis) {
            console.log('redis에서 가져온 데이터');
            return checkRedis;
        } else {
            // 3. redis에 값이 없으면 elasticsearch에서 search값으로 검색을 실행
            const searchResult = await this.elasticsearchService.search({
                index: 'car_type',
                query: {
                    bool: {
                        should: [{ "prefix": { "description": search } }]
                    },
                },
            });

            if (searchResult) {
                // 4. 해당정보의 검색값을 CarType으로 정리한다
                const resultArray = searchResult.hits.hits;

                const finalResult = resultArray.map((el) => {
                    const result: CarType = {
                        id: el._source['id'],
                        type: el._source['type'],
                        description: el._source['description'],
                        updatedAt: el._source['updatedat'],
                    };
                    return result;
                });

                // 5. 마지막으로 가져온 정보값을 redis에 캐싱해준다
                await this.cachManager.set(search, finalResult, { ttl: 1800 });

                console.log('elasticsearch에서 검색한 데이터');

                return finalResult;
            }
        }
    }

    @Mutation(() => CarType)
    async createCarType(
        @Args('id') id: string,
        @Args('type') type: string,
        @Args('description') description: string,
    ) {
        return await this.carTypeService.create({ id, type, description });
    }
}
