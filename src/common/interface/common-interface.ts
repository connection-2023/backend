import { PrismaService } from '@src/prisma/prisma.service';

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export interface UserTokenPayload {
  userId: number;
  iat: number;
  exp: number;
}

export interface LecturerTokenPayload {
  lecturerId: number;
  iat: number;
  exp: number;
}

export interface ApiErrorResponse {
  name: string;
  example: ApiErrorExample;
}

export interface ApiErrorExample {
  msg: string;
  response?: any;
}

export interface Region {
  administrativeDistrict: string;
  district: string;
}

export interface Id {
  id: number;
}

export interface PrismaTransaction
  extends Omit<
    PrismaService,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
  > {}
