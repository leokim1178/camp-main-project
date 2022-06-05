import {
    CACHE_MANAGER,
    ConflictException,
    Inject,
    UnauthorizedException,
    UnprocessableEntityException,
    UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { GqlAuthRefreshGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-currentUser';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService, //
        private readonly userService: UserService,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {}

    @Mutation(() => String)
    async login(
        @Args('email') //
        email: string,
        @Args('password')
        password: string,
        @Context()
        context: any,
    ) {
        //1. 로그인(이메일과 비밀번호가 일치하는 유저 찾기)
        const user = await this.userService.findOne({ email });
        //2. 일치하는 유저가 없으면? 에러 던지기
        if (!user)
            throw new UnprocessableEntityException(
                '해당 이메일이 존재하지 않습니다',
            );

        //3. 일치하는 유저가 있지만, 암호가 틀렸다면? 에러 던지기
        const isAuth = await bcrypt.compare(password, user.password);
        if (!isAuth)
            throw new UnprocessableEntityException('패스워드가 틀렸습니다.');

        //4. refreshToken(=JWT)을 만들어서 프론트엔드(쿠키)에 보내주기
        this.authService.setRefreshToken({ user, res: context.res });

        //4. 일치하는 유저가 있으면? 그 유저를 위한  accessToken(JWT)을 준비
        return this.authService.getAccessToken({ user });
    }

    @Mutation(() => String)
    async logout(
        @Context()
        context: any,
    ) {
        //1. 토큰 추출
        const access = context.req.headers.authorization;
        const cookie = context.req.headers.cookie;

        const accessToken = access.split(' ')[1];
        const refreshToken = cookie.replace('refreshToken=', '');
        try {
            //2-1. 토큰 검증
            const accessResult = jwt.verify(accessToken, 'accessKey');
            const refreshResult = jwt.verify(refreshToken, 'refreshKey');
            //2-2. 토큰 만료일 확인
            const accexp = Object.values(accessResult)[3];
            const refexp = Object.values(refreshResult)[3];

            //3. 이미 로그아웃된 유저인지 확인
            const searchAccess = await this.cacheManager.get(
                `accessToken:${accessToken}`,
            );
            const searchRefresh = await this.cacheManager.get(
                `refreshToken:${refreshToken}`,
            );

            if (searchRefresh || searchAccess)
                throw new ConflictException('이미 로그아웃된 유저입니다');

            //4. redis에 log-out blacklist 저장
            await this.cacheManager.set(
                `accessToken:${accessToken}`,
                'accessToken',
                { ttl: accexp },
            );
            await this.cacheManager.set(
                `refreshToken:${refreshToken}`,
                'refreshToken',
                { ttl: refexp },
            );
            //5. 완료 메세지 전송
            return '로그아웃에 성공했습니다';
        } catch (error) {
            if (error.status == 409)
                throw new UnauthorizedException(error.response);

            // 검증 오류(토큰 만료)시 redis의 blacklist에서 삭제
            await this.cacheManager.del(`accessToken:${accessToken}`);
            await this.cacheManager.del(`refreshToken:${refreshToken}`);
            throw new UnauthorizedException('토큰 검증 실패');
        }
    }

    @UseGuards(GqlAuthRefreshGuard)
    @Mutation(() => String)
    restoreAccessToken(
        @CurrentUser()
        currentUser: ICurrentUser,
    ) {
        console.log(currentUser);
        return this.authService.getAccessToken({ user: currentUser });
    }
}
