import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CarModel } from '../../carModel/entities/carModel.entity';

@Entity() //Entity라는 함수 안에 내부를 table로 만들어주는 기능이 내장되어 있다
@ObjectType()
export class CarTag {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    name: string;

    @ManyToMany(() => CarModel, (cars) => cars.carTags)
    @Field(() => [CarModel])
    carModel: CarModel[];
}
