import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payload } from '@src/auth/interface/interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from '@src/prisma/prisma.service';
import { Lecturer, Users } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Token } from '@src/common/interface/common-interface';
import { TokenTypes } from '@src/auth/enums/token-enums';

@Injectable()
export class AuthTokenService implements OnModuleInit {
  private readonly logger = new Logger(AuthTokenService.name);

  private jwtAccessTokenExpiresIn: string;
  private jwtRefreshTokenExpiresIn: string;
  private jwtRefreshTokenTtl: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.jwtAccessTokenExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_TOKEN_EXPIRES_IN',
    );
    this.jwtRefreshTokenExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
    );
    this.jwtRefreshTokenTtl = this.configService.get<number>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.logger.log('AuthTokenService Init');
  }

  async generateToken(payload: Payload, tokenType: TokenTypes): Promise<Token> {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtAccessTokenExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtRefreshTokenExpiresIn,
    });

    const targetId = payload.userId || payload.lecturerId;
    await this.cacheManager.set(
      `${tokenType} ${targetId}`,
      refreshToken,
      this.jwtRefreshTokenTtl,
    );

    return { accessToken, refreshToken };
  }

  async getUserByPayload(payloadUserId: number): Promise<Users> {
    return await this.prismaService.users.findFirst({
      where: { id: payloadUserId, deletedAt: null },
    });
  }
  async getLecturerByPayload(payloadUserId: number): Promise<Lecturer> {
    return await this.prismaService.lecturer.findFirst({
      where: { id: payloadUserId, deletedAt: null },
    });
  }

  async validateRefreshToken(
    refreshToken: string,
    targetId: number,
    tokenType: TokenTypes,
  ): Promise<void> {
    const cachedRefreshToken = await this.cacheManager.get(
      `${tokenType} ${targetId}`,
    );
    if (!cachedRefreshToken) {
      throw new UnauthorizedException(
        `로그인 정보가 만료되었습니다. 다시 로그인해 주세요`,
      );
    }

    if (refreshToken !== cachedRefreshToken) {
      await this.cacheManager.del(`${tokenType} ${targetId}`);
      throw new UnauthorizedException(
        `로그인 정보가 일치하지 않습니다. 다시 로그인해 주세요`,
      );
    }
  }

  async regenerateToken(
    authorizedTarget: Payload,
    tokenType: TokenTypes,
  ): Promise<Token> {
    const targetId: number =
      authorizedTarget.userId || authorizedTarget.lecturerId;
    await this.cacheManager.del(`${tokenType} ${targetId}`);

    const token: Token = await this.generateToken(authorizedTarget, tokenType);

    return token;
  }

  async switchUserToLecturer(user: Users): Promise<Token> {
    const selectedLecturer: Lecturer =
      await this.prismaService.lecturer.findFirst({
        where: { userId: user.id, deletedAt: null },
      });

    await this.cacheManager.del(`${TokenTypes.User} ${user.id}`);

    const token: Token = await this.generateToken(
      { lecturerId: selectedLecturer.id },
      TokenTypes.Lecturer,
    );

    return token;
  }

  async switchLecturerToUser(lecturer: Lecturer): Promise<Token> {
    const selectedUser: Users = await this.prismaService.users.findFirst({
      where: { id: lecturer.userId, deletedAt: null },
    });

    await this.cacheManager.del(`${TokenTypes.Lecturer} ${lecturer.id}`);

    const token: Token = await this.generateToken(
      { userId: selectedUser.id },
      TokenTypes.User,
    );

    return token;
  }
}