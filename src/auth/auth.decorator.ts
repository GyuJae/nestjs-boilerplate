import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().user;
  },
);

export type AllowedRoles = keyof typeof Role | 'Any';

export const Roles = (...role: AllowedRoles[]) => SetMetadata('roles', role);
