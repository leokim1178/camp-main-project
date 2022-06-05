import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity()
@ObjectType()
export class CarType {
    @PrimaryColumn()
    @Field(() => String)
    id: string;
    @Column()
    @Field(() => String)
    type: string;
    @Column({ type: 'longtext' })
    @Field(() => String)
    description: string;
    @UpdateDateColumn()
    updatedAt: Date;
}
