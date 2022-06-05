import { Field, InputType } from '@nestjs/graphql';
import { CreateCarWheelInput } from '../../carWheel/dto/createCarWheelInput';

@InputType()
export class CreateCarCustomInput {
    @Field(() => String)
    color: string;
    @Field(() => String)
    interior: string;
    @Field(() => Boolean)
    isAuto: boolean;

    @Field(() => String)
    carModelId: string;

    @Field(() => CreateCarWheelInput)
    createCarWheelInput: CreateCarWheelInput;
}
