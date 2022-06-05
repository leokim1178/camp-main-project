import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) {}

    getAccessToken({ user }) {
        return this.jwtService.sign(
            { email: user.email, sub: user.id },
            { secret: 'accessKey', expiresIn: '30m' },
        );
    }

    setRefreshToken({ user, res }) {
        const refreshToken = this.jwtService.sign(
            { email: user.email, sub: user.id },
            { secret: 'refreshKey', expiresIn: '2w' },
        );

        // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
        res.setHeader(
            'Set-Cookie',
            `refreshToken=${refreshToken}; path=/; domain=localhost; SameSite=None; Secure; httpOnly;`,
        );
    }

    async socialLogin({ req, res }) {
        //1. 가입확인
        let user = await this.userService.findOne({ email: req.user.email });
        // const hashedPW = //
        //     await bcrypt.hash(req.user.password, 10).then((res) => res);
        //2. 회원가입
        if (!user) {
            user = await this.userService.create({
                email: req.user.email,
                hashedPW: req.user.password,
                name: req.user.name,
                age: req.user.age, //스프레드 연산자 써도됨
            });
        }

        //3. 로그인
        //로그인 시키는 것 : access와 refresh 두개 던지기
        this.setRefreshToken({ user, res });

        res.redirect(
            'http://localhost:5500/homework/main-project/frontend/login/index.html',
        );
    }
}
