import { Injectable } from '@nestjs/common';

import axios from 'axios';
import { config } from 'dotenv';

config();

@Injectable()
export class IamportService {
    //
    //Iamport에 등록된결제정보 조회
    async getPaymentData({ accessToken, impUid }) {
        const response = await axios({
            url: `https://api.iamport.kr/payments/${impUid}`, // imp_uid 전달
            method: 'get', // GET method
            headers: { Authorization: accessToken }, // 인증 토큰 Authorization header에 추가
        });
        return response.data.response;
    }

    //Iamport api 사용을 위한 액세슨 토큰 발급요청
    async getIamportToken() {
        const response = await axios({
            url: 'https://api.iamport.kr/users/getToken',
            method: 'post', // POST method
            headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
            data: {
                imp_key: process.env.IMP_KEY,
                imp_secret: process.env.IMP_SECRET_KEY,
            },
        });
        return response.data.response.access_token;
    }

    //결제 취소 api
    async cancelPay({
        accessToken,
        cancelReason,
        impUid,
        cancelRequestAmount,
    }) {
        const response = await axios({
            url: 'https://api.iamport.kr/payments/cancel',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken, // 아임포트 서버로부터 발급받은 엑세스 토큰
            },
            data: {
                reason: cancelReason, // 가맹점 클라이언트로부터 받은 환불사유
                imp_uid: impUid, // imp_uid를 환불 `unique key`로 입력
                amount: cancelRequestAmount, // 가맹점 클라이언트로부터 받은 환불금액
            },
        });

        return response.data.response;
    }
}
