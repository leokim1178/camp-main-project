import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCarCustomInput } from './createCarCustomInput';

@InputType()
export class UpdateCarCustomInput extends PartialType(CreateCarCustomInput) {}
