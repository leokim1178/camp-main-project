import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';

@Resolver()
export class TestResolver {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @Query(() => String)
  async fetchRedis() {
    const mycache = await this.cacheManager.get('name');
    console.log(mycache);
    if (!mycache) return '정보 없음';

    return '캐시테스트 중 결과: ' + mycache;
  }

  @Mutation(() => String)
  async createRedisLog() {
    await this.cacheManager.set('name', '철수', {
      ttl: 3,
    });
    return '캐시 테스트 중!!';
  }
}
