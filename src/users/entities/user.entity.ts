import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { CoreEntity } from 'src/core/entities/core.entity';

@ObjectType()
export class UserEntity extends CoreEntity implements User {
  @Field(() => String)
  email: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;

  @Field(() => String, { nullable: true })
  avatar: string | null;
}
