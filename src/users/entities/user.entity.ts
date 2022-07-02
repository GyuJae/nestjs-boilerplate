import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Role, User } from '@prisma/client';
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

  @Field(() => Role, { defaultValue: 'USER' })
  role: Role;
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role client or admin',
  valuesMap: {
    USER: {
      description: 'User for client',
    },
    ADMIN: {
      description: 'Admin for me',
    },
  },
});
