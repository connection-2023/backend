import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LecturerPaymentsService } from '../services/lecturer-payments.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiCreateLecturerBankAccount } from '../swagger-decorators/create-lecturer-bank-account.decorator';
import { SetResponseKey } from '@src/common/decorator/set-response-meta-data.decorator';
import { GetAuthorizedUser } from '@src/common/decorator/get-user.decorator';
import { ValidateResult } from '@src/common/interface/common-interface';
import { CreateBankAccountDto } from '../dtos/create-bank-account.dto';
import { LecturerBankAccountDto } from '../dtos/lecturer-bank-account.dto';
import { LecturerAccessTokenGuard } from '@src/common/guards/lecturer-access-token.guard';

@ApiTags('강사-결제')
@Controller('lecturer-payments')
export class LecturerPaymentsController {
  constructor(
    private readonly lecturerPaymentsService: LecturerPaymentsService,
  ) {}

  @ApiCreateLecturerBankAccount()
  @SetResponseKey('createdLecturerBankAccount')
  @Post('/bank-account')
  @UseGuards(LecturerAccessTokenGuard)
  async createLecturerBankAccount(
    @GetAuthorizedUser() authorizedData: ValidateResult,
    @Body() createBankAccountDto: CreateBankAccountDto,
  ): Promise<LecturerBankAccountDto> {
    return await this.lecturerPaymentsService.createLecturerBankAccount(
      authorizedData.lecturer.id,
      createBankAccountDto,
    );
  }
}
