import { UserEntity } from './../entities/user.entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/coreOutput.dto';

@InputType()
export class LoginInput extends PickType(
  UserEntity,
  ['email', 'password'],
  InputType,
) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(() => String, { nullable: true })
  token?: string;
}
