import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Connection, Repository } from 'typeorm';
import { CarCustom } from '../car/carCustom/entities/carCustom.entity';
import { User } from '../user/entities/user.entity';
import { Payment, PAYMENT_STATUS_ENUM } from './entities/payment.entity';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(CarCustom)
        private readonly carCustomRepository: Repository<CarCustom>,
        private readonly connection: Connection,
    ) {}

    //결제정보 생성 및 저장
    async create({ impUid, amount, currentUser, merchantUid, carCustomId }) {
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('SERIALIZABLE');
        //transaction 시작!
        try {
            //0. 커스텀정보 가져오기
            const carCustom = await this.carCustomRepository.findOne({
                id: carCustomId,
            });

            //1. Payment 테이블에 거래기록 1줄 생성
            const payment = this.paymentRepository.create({
                impUid: impUid,
                amount: amount,
                user: currentUser,
                merchantUid: merchantUid,
                carCustom,
                status: PAYMENT_STATUS_ENUM.PAYMENT,
            });

            await queryRunner.manager.save(payment);
            // await this.paymentRepository.save(payment);

            //2. 유저 돈 찾아오기
            const user = await queryRunner.manager.findOne(
                User, //
                { id: currentUser.id },
                { lock: { mode: 'pessimistic_write' } },
            );
            // const user = await this.userRepository.findOne({
            //     where: { id: currentUser.id },
            // });
            //3. 유저의 돈 업데이트
            // await this.userRepository.update(
            //     { id: user.id },
            //     { point: user.point + amount },
            // );
            const updatedUser = this.userRepository.create({
                ...user,
                point: user.point + amount,
            });
            await queryRunner.manager.save(updatedUser);

            await queryRunner.commitTransaction();

            //4.최종결과를 프론트에 돌려주기
            console.log('저장완료');
            return payment;
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    //DB의 결제정보 조회
    async findById({ merchantUid }) {
        return await this.paymentRepository.findOne({
            where: { merchantUid: merchantUid },
        });
    }

    //결제취소정보 생성 및 DB저장
    async createPaymentCancel({
        currentUser,
        amount,
        merchantUid,
        cancelReason,
        impUid,
    }) {
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('SERIALIZABLE');
        //transaction 시작!!
        try {
            //1. Payment 테이블에 취소기록 1줄 생성
            const payment = this.paymentRepository.create({
                impUid: impUid,
                amount: -amount,
                user: currentUser,
                merchantUid: merchantUid,
                cancelReason: cancelReason,
                status: PAYMENT_STATUS_ENUM.CANCEL,
            });

            const result = await queryRunner.manager.save(payment);
            // await this.paymentRepository.save(result);

            //2. 유저 돈 찾아오기
            const user = await queryRunner.manager.findOne(
                User,
                { id: currentUser.id },
                { lock: { mode: 'pessimistic_write' } },
            );
            // const user = await this.userRepository.findOne({
            //     where: { id: currentUser.id },
            // });

            //3. 유저의 돈 업데이트
            const updatedUser = this.userRepository.create({
                ...user,
                point: user.point - amount,
            });

            await queryRunner.manager.save(updatedUser);

            await queryRunner.commitTransaction();
            // await this.userRepository.update(
            //     { id: user.id },
            //     { point: user.point - amount },
            // );
            //4. 저장 결과 돌려주기
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}
