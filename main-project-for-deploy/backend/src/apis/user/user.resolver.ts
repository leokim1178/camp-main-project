import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/updateUserInput';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CurrentUser } from 'src/commons/auth/gql-currentUser';
import { UseGuards } from '@nestjs/common';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => String)
    fetch(
        @CurrentUser()
        currentUser: any,
    ) {
        console.log('fetch 실행완료');
        console.log(currentUser);
        return 'asdf';
    }
    //전체 유저 조회
    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [User])
    fetchUsers(
        @CurrentUser()
        currentUser: any,
    ) {
        console.log(currentUser, '님이 로그인 중');
        return this.userService.findAll();
    }

    //이메일로 유저 조회
    @UseGuards(GqlAuthAccessGuard)
    @Query(() => User)
    async fetchUser(
        @CurrentUser()
        currentUser: any,
        @Args('email')
        email: string,
    ) {
        return this.userService.findOne({ email });
    }

    //유저 생성
    @Mutation(() => User)
    async createUser(
        @Args('email')
        email: string, //
        @Args('password')
        password: string,
        @Args('name')
        name: string,

        @Args('age')
        age: string,
    ) {
        const hashedPW = //
            await bcrypt.hash(password, 10).then((res) => res);

        return this.userService.create({
            email,
            hashedPW,
            name,
            age,
        });
    }

    //유저정보 업데이트
    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => User)
    async updateUser(
        @Args('updateUserInput')
        updateUserInput: UpdateUserInput,
        @CurrentUser()
        currentUser: any,
        @Args('email')
        email: string,
    ) {
        return this.userService.update({
            updateUserInput,
            email,
        });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Boolean)
    async deleteUser(
        @CurrentUser()
        currentUser: any,
        @Args('email')
        email: string,
    ) {
        return this.userService.delete({ email });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Boolean)
    async restoreUser(
        @CurrentUser()
        currentUser: any,
        @Args('email')
        email: string,
    ) {
        return this.userService.restore({ email });
    }
}
