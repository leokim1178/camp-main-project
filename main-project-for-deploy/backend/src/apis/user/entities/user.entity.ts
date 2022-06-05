import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
    Column,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    email: string;
    @Column()
    //@Field(() => String) 비밀번호 노출 금지를 위함
    password: string;
    @Column()
    @Field(() => String)
    name: string;

    @Column()
    @Field(() => String)
    age: string;

    @DeleteDateColumn({ nullable: true })
    @Field(() => Date, { nullable: true })
    deletedAt: Date;

    @UpdateDateColumn()
    @Field(() => Date)
    updatedAt: Date;

    @Column({ default: 0 })
    @Field(() => Int)
    point: number;
}
