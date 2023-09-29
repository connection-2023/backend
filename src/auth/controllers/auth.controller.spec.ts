import { Test, TestingModule } from '@nestjs/testing';
import { AuthSmsController } from './auth-sms.controller';

describe('AuthController', () => {
  let controller: AuthSmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthSmsController],
    }).compile();

    controller = module.get<AuthSmsController>(AuthSmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
