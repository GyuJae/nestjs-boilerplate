import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/coreOutput.dto';
import { UserEntity } from '../entities/user.entity';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(UserEntity, ['avatar', 'username'], InputType),
) {}

@ObjectType()
export class EditProfileOutput extends CoreOutput {}
