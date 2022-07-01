import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/coreOutput.dto';
import { UserEntity } from '../entities/user.entity';

@InputType({ isAbstract: true })
export class CraeteAccountInput extends PickType(
  UserEntity,
  ['email', 'username', 'password'],
  InputType,
) {}

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
