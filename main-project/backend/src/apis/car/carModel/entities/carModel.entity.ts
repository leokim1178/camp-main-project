import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CarType } from 'src/apis/car/carType/entities/carType.entity';
import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { CarTag } from '../../carTag/entities/carTag.entity';

@Entity()
@ObjectType()
export class CarModel {
    @PrimaryColumn()
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    model: string;

    @Column()
    @Field(() => Int)
    range: number;

    @Column()
    @Field(() => Int)
    speed: number;

    @Column({ type: 'decimal' })
    @Field(() => Float)
    zero100: number;

    @Column()
    @Field(() => Int)
    price: number;

    @Column()
    @Field(() => String)
    wd: string;

    @Column()
    @Field(() => String)
    description: string;

    @DeleteDateColumn({ nullable: true }) //
    @Field(() => Date, { nullable: true })
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => CarType)
    @Field(() => CarType)
    carType: CarType;

    @JoinTable()
    @ManyToMany(() => CarTag, (carTags) => carTags.carModel)
    @Field(() => [CarTag])
    carTags: CarTag[];
}
