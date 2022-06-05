import {
    ConflictException,
    UnprocessableEntityException,
    UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth-guard';
import { CurrentUser, ICurrentUser } from 'src/commons/auth/gql-currentUser';
import { IamportService } from '../iamport/iamport.service';

import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly iamportService: IamportService,
    ) {}

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Payment)
    async createPayment(
        @Args('impUid') impUid: string,
        @Args('merchantUid') merchantUid: string,
        @Args('amount') amount: number,
        @Args('carCustomId') carCustomId: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        const accessToken = await this.iamportService.getIamportToken();
        const paymentData = await this.iamportService.getPaymentData({
            accessToken,
            impUid,
        });
        console.log(paymentData.status);
        const registerd = await this.paymentService.findById({
            merchantUid: paymentData.merchant_uid,
        });
        if (paymentData.status !== 'paid')
            throw new UnprocessableEntityException(
                '유효하지않은 아이디입니다 ',
            );
        console.log('1차 통과');
        if (registerd)
            throw new ConflictException('이미 등록된 결제정보입니다.');
        console.log('2차 통과');

        if (paymentData.amount == amount) {
            return await this.paymentService.create({
                impUid,
                amount,
                currentUser,
                merchantUid,
                carCustomId,
            });
        }
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Payment)
    async cancelPayment(
        @CurrentUser()
        currentUser: ICurrentUser,
        @Args('merchantUid')
        merchantUid: string,
        @Args('cancelRequestAmount')
        cancelRequestAmount: number,
        @Args('cancelReason', { nullable: true })
        cancelReason: string,
    ) {
        const accessToken = await this.iamportService.getIamportToken();
        const userPayment = await this.paymentService.findById({ merchantUid });
        if (!userPayment)
            throw new UnprocessableEntityException(
                '취소할 결제정보가 없습니다 ',
            );
        console.log('정보 확인완료');

        const paymentData = await this.iamportService.getPaymentData({
            accessToken,
            impUid: userPayment.impUid,
        });
        if (paymentData.status !== 'paid')
            throw new UnprocessableEntityException(
                '유효하지 않은 아이디입니다',
            );
        console.log('아이디 유효');

        if (cancelRequestAmount > paymentData.amount)
            throw new UnprocessableEntityException(
                '취소할 금액이 결제금액보다 많습니다',
            );
        console.log('취소할 금액<결제금액');

        const cancelData = await this.iamportService.cancelPay({
            accessToken,
            cancelReason,
            cancelRequestAmount,
            impUid: userPayment.impUid,
        });

        if (cancelData.status !== 'cancelled')
            throw new ConflictException('결제가 취소되지 않았습니다');
        console.log('결제취소 완료');

        const updatedPayment = await this.paymentService.createPaymentCancel({
            currentUser,
            amount: cancelData.amount,
            merchantUid: cancelData.merchant_uid,
            cancelReason: cancelData.cancel_reason,
            impUid: cancelData.imp_uid,
        });

        return updatedPayment;
    }
}
