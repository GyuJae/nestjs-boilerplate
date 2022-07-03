import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CraeteAccountInput,
  CreateAccountOutput,
} from './dtos/createAccount.dto';
import * as bcrypt from 'bcrypt';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { AuthService } from 'src/auth/auth.service';
import { EditProfileInput, EditProfileOutput } from './dtos/editProfile.dto';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

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

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
        select: { id: true, password: true },
      });
      if (!user) throw new Error('❌ Not Found User by this email.');

      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) throw new Error('❌ Wrong Password.');

      const { token } = await this.authService.sign({ userId: user.id });
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }

  async editProfile(
    editProfileInput: EditProfileInput,
    userId: number,
  ): Promise<EditProfileOutput> {
    try {
      const currentUser = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
        },
      });
      if (!currentUser) throw new Error('❌ User Not Found.');
      await this.prismaService.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          ...editProfileInput,
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
