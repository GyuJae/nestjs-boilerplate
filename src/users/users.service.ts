import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CraeteAccountInput,
  CreateAccountOutput,
} from './dtos/createAccount.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async createAccount({
    email,
    username,
    password,
  }: CraeteAccountInput): Promise<CreateAccountOutput> {
    try {
      const emailExist = await this.prismaService.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });
      if (emailExist) throw new Error('❌ This Email already exist.');

      const usernameExist = await this.prismaService.user.findUnique({
        where: {
          username,
        },
        select: {
          id: true,
        },
      });

      if (usernameExist) throw new Error('❌ This Username already exist.');

      const hashPassword = await bcrypt.hash(password, 10);
      await this.prismaService.user.create({
        data: {
          email,
          username,
          password: hashPassword,
        },
      });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
