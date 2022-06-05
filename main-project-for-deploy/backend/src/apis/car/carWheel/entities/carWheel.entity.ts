import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class CarWheel {
    @PrimaryColumn()
    @Field(() => String)
    wheelId: string;
    @Column()
    @Field(() => String)
    wheelName: string;
    @Column()
    @Field(() => Int)
    wheelSize: number;
    @Column()
    @Field(() => Int)
    wheelPrice: number;

    @UpdateDateColumn()
    @Field(() => Date)
    updatedAt: Date;
}
