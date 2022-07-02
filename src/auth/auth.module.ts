import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { GqlAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Global()
@Module({
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
