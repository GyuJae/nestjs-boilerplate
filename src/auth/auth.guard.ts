import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AllowedRoles } from './auth.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );
    if (!roles) return true;

    // req (http)
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    if (req) {
      const headers = req.headers;
      if (
        headers &&
        typeof headers === 'object' &&
        headers.hasOwnProperty('x-jwt')
      ) {
        const token = headers['x-jwt'];
        const user = await this.authService.verify(token);

        const gqlContext = ctx.getContext();
        if (user) {
          gqlContext['user'] = user;
          if (roles.includes('Any')) {
            return true;
          }
          return roles.includes(user.role);
        } else {
          gqlContext['uesr'] = null;
        }
      }
    }
    return false;
  }
}
