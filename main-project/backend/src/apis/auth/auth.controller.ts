import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

interface IOAuthUser {
    user: Pick<User, 'email' | 'password' | 'name' | 'age'>;
}

@Controller()
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Get('/login/google')
    @UseGuards(AuthGuard('google'))
    async loginGoogle(
        @Req() req: Request & IOAuthUser, //  & 는 두개를 더하는 것
        @Res() res: Response,
    ) {
        this.authService.socialLogin({ req, res });
    }

    @Get('/login/naver')
    @UseGuards(AuthGuard('naver'))
    async loginNaver(
        @Req()
        req: Request & IOAuthUser,
        @Res()
        res: Response,
    ) {
        this.authService.socialLogin({ req, res });
    }

    @Get('/login/kakao')
    @UseGuards(AuthGuard('kakao'))
    async loginKakao(
        @Req()
        req: Request & IOAuthUser,
        @Res()
        res: Response,
    ) {
        this.authService.socialLogin({ req, res });
    }

    // @Get([`/login/kakao`, '/login/naver', '/login/google'])
    // @UseGuards(AuthGuard(['kakao', 'naver', 'google']))
    // async loginSocial(
    //     @Req()
    //     req: Request & IOAuthUser,
    //     @Res()
    //     res: Response,
    // ) {
    // console.log(req.route.path.replace('/login/', ''));
    //     let user = await this.userService.findOne({
    //         email: req.user.email,
    //     });
    //     if (!user) {
    //         user = await this.userService.create({
    //             email: req.user.email,
    //             hashedPW: req.user.password,
    //             name: req.user.name,
    //             age: req.user.age,
    //         });
    //     }

    //     this.authService.setRefreshToken({ user, res });

    //     res.redirect(
    //         'http://localhost:5501/main-project/frontend/login/index.html',
    //     );
    // }
}
