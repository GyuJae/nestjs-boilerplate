import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('UserService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaService],
      providers: [
        UsersService,
        PrismaService,
        AuthService,
        JwtService,
        ConfigService,
      ],
    }).compile();
    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<UsersService>(UsersService);
    await prisma.user.deleteMany({});
  });

  const userInfo = {
    email: 'test@test.com',
    password: '1',
    username: 'test',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('createAccount()', () => {
    it('should create user', async () => {
      const result = await service.createAccount(userInfo);
      expect(result.ok).toBe(true);
    });

    it('already email', async () => {
      const result = await service.createAccount({
        ...userInfo,
        username: 'newUsername',
      });
      expect(result).toMatchObject({
        ok: false,
        error: '❌ This Email already exist.',
      });
    });

    it('already username', async () => {
      const result = await service.createAccount({
        ...userInfo,
        email: 'newEmail@newEmail.com',
      });
      expect(result).toEqual({
        ok: false,
        error: '❌ This Username already exist.',
      });
    });
  });

  describe('login()', () => {
    it('should login success', async () => {
      const result = await service.login({
        email: 'test@test.com',
        password: '1',
      });

      expect(result.ok).toBe(true);
    });

    it('Not Found User', async () => {
      const result = await service.login({
        email: 'notFoundEmail@notFoundEmail.com',
        password: '1',
      });

      expect(result.ok).toBe(false);
      expect(result.error).toBe('❌ Not Found User by this email.');
    });

    it('Wrong User', async () => {
      const result = await service.login({
        email: 'test@test.com',
        password: 'wrong password',
      });

      expect(result.ok).toBe(false);
      expect(result.error).toBe('❌ Wrong Password.');
    });
  });

  describe('editProfile()', () => {
    it('User Not Found', async () => {
      const result = await service.editProfile({ avatar: 'newAvatar' }, 999);
      expect(result).toEqual({
        ok: false,
        error: '❌ User Not Found.',
      });
    });

    it('Edit User', async () => {
      const { id } = await prisma.user.findFirst({ select: { id: true } });
      const result = await service.editProfile({ avatar: 'newAvatar' }, id);
      expect(result.ok).toBe(true);
    });
  });
});
