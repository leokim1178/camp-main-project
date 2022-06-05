import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {
        super({
            jwtFromRequest: (req) =>
                req.headers.cookie.replace('refreshToken=', ''),
            secretOrKey: 'refreshKey',
        });
    }

    async validate(req, payload) {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        const result = await this.cacheManager.get(
            `refreshToken:${refreshToken}`,
        );
        if (result) throw new UnauthorizedException('리프레시 토큰 검증 실패');
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}
