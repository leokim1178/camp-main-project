import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCarWheelInput {
    @Field(() => String)
    wheelId: string;

    @Field(() => String)
    wheelName: string;

    @Field(() => Int)
    wheelSize: number;

    @Field(() => Int)
    wheelPrice: number;
}
