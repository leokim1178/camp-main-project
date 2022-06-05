import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarCustom } from '../car/carCustom/entities/carCustom.entity';
import { IamportService } from '../iamport/iamport.service';
import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User, //
            Payment,
            CarCustom,
        ]),
    ],
    providers: [PaymentService, PaymentResolver, IamportService],
})
export class PaymentModule {}
