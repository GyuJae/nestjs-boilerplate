import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async sign({ userId }: { userId: number }): Promise<{ token: string }> {
    const payload = { id: userId };
    return {
      token: this.jwtService.sign(payload, {
        privateKey: this.configService.get('JWT_PRIVATE_KEY'),
      }),
    };
  }

  async verify(token: string): Promise<UserEntity | null> {
    try {
      const { id } = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_PRIVATE_KEY'),
      });
      if (!id) throw new Error('❌ Verify Error not found id');
      const user = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) throw new Error('❌ Not Found User');

      return user;
    } catch {
      return null;
    }
  }
}
