import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService, ConfigService],
      exports: [AuthService],
    }).compile();
    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('sign()', () => {
    it('should return token', async () => {
      const firstUser = await prisma.user.findFirst({});
      const { token } = await service.sign({
        userId: firstUser.id,
      });
      expect(typeof token).toBe('string');
    });
  });

  describe('verify()', () => {
    it('should return user', async () => {
      const firstUser = await prisma.user.findFirst({});
      const { token } = await service.sign({
        userId: firstUser.id,
      });
      const user = await service.verify(token);
      expect(firstUser.id === user.id).toBe(true);
    });

    it('should return error', async () => {
      const result = await service.verify('wrong token');
      expect(result).toBeNull();
    });
  });
});
