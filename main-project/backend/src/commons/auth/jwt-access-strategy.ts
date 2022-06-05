import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'accessKey',
            passReqToCallback: true,
        });
    }

    async validate(req, payload) {
        const access = req.headers.authorization;
        const accessToken = access.split(' ')[1];

        const result = await this.cacheManager.get(
            `accessToken:${accessToken}`,
        );
        if (result) throw new UnauthorizedException('액세스 토큰 검증 실패');
        return {
            id: payload.sub,
            email: payload.email,
            //이 두가지는 context안 request 안에 유저안에 id랑 이메일을 첨부되었다
        };
    }
}
