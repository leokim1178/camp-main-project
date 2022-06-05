import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    //전체 유저 조회
    async findAll() {
        return await this.userRepository.find({
            withDeleted: true, //
        });
    }
    //이메일로 유저 조회
    async findOne({ email }) {
        return await this.userRepository.findOne({
            where: {
                email,
            },
            withDeleted: true,
        });
    }

    //유저 생성
    async create({ email, name, age, hashedPW: password }) {
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (user) throw new ConflictException('이미 등록된 이메일입니다'); //409번

        return await this.userRepository.save({
            email,
            password,
            name,
            age,
        });
    }

    //유저정보 업데이트
    async update({ updateUserInput, email }) {
        const prevUser = await this.userRepository.findOne({
            where: { email },
        });
        const hashedPW = //
            await bcrypt.hash(updateUserInput.password, 10).then((res) => res);
        return await this.userRepository.save({
            ...prevUser,
            ...updateUserInput,
            password: hashedPW,
        });
    }

    //유저정보 삭제(softDelete)
    async delete({ email }) {
        const result = await this.userRepository.softDelete({
            email,
        });
        return result.affected ? true : false;
    }

    //유저정보 복구
    async restore({ email }) {
        const result = await this.userRepository.restore({
            email,
        });
        return result.affected ? true : false;
    }
}
