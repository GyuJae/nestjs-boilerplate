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

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('createAccount()', () => {
    it('should create user', async () => {
      const result = await service.createAccount({
        email: 'test@test.com',
        password: '1',
        username: 'test',
      });
      expect(result).toEqual({
        ok: true,
        error: undefined,
      });
    });

    it('already email', async () => {
      const result = await service.createAccount({
        email: 'test@test.com',
        password: '1',
        username: 'newUsername',
      });
      expect(result).toEqual({
        ok: false,
        error: '❌ This Email already exist.',
      });
    });

    it('already username', async () => {
      const result = await service.createAccount({
        email: 'newEmail@newEmail.com',
        password: '1',
        username: 'test',
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
});
