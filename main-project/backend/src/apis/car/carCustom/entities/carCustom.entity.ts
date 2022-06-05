import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { CarModel } from '../../carModel/entities/carModel.entity';
import { CarWheel } from '../../carWheel/entities/carWheel.entity';

@Entity()
@ObjectType()
export class CarCustom {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;
    @Column()
    @Field(() => String)
    color: string;
    @Column()
    @Field(() => String)
    interior: string;

    @Column()
    @Field(() => Boolean)
    isAuto: boolean; // auto price : ?

    @Column({ default: 100000, nullable: true })
    @Field(() => Int, { nullable: true })
    autoPrice: number;

    @JoinColumn() //컬럼을 가지고 연결하겠다는 뜻... 기준이 있는곳에 이걸 둔다
    @OneToOne(() => CarWheel) // 일대일 관계 괄호안에 함수가 들어감
    @Field(() => CarWheel)
    carWheel: CarWheel;

    @ManyToOne(() => CarModel)
    @Field(() => CarModel)
    carModel: CarModel;

    @UpdateDateColumn()
    @Field(() => Date)
    updatedAt: Date;
}
