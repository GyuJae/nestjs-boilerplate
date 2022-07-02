import { LoginInput, LoginOutput } from './dtos/login.dto';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CraeteAccountInput,
  CreateAccountOutput,
} from './dtos/createAccount.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private userService: UsersService) {}

  @Query(() => Boolean)
  hello() {
    return true;
  }

  @Mutation(() => CreateAccountOutput, { description: 'Create Account' })
  async createAccount(
    @Args('input') createAccountInput: CraeteAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.userService.createAccount(createAccountInput);
  }

  @Mutation(() => LoginOutput, { description: 'Login' })
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }
}
