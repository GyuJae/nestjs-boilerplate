import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UserService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaService],
      providers: [UsersService, PrismaService],
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
});
