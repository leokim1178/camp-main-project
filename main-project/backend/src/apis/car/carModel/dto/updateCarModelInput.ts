import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCarModelInput } from './createCarModelInput';

@InputType()
export class UpdateCarModelInput extends PartialType(CreateCarModelInput) {}
