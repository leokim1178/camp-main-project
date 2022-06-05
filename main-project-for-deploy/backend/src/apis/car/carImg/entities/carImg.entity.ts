import { Field, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CarCustom } from '../../carCustom/entities/carCustom.entity';

@Entity()
@ObjectType()
export class CarImg {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    imgURL: string;

    @ManyToOne(() => CarCustom)
    @Field(() => CarCustom)
    carCustom: CarCustom;

    @UpdateDateColumn()
    @Field(() => Date)
    updatedAt: Date;
}
