import { Injectable } from '@nestjs/common';
import { PassRepository } from '../repository/pass.repository';
import { generatePaginationParams } from '@src/common/utils/generate-pagination-params';
import { GetUserPassListDto } from '../dtos/request/get-user-pass-list.dto';
import { IPaginationParams } from '@src/common/interface/common-interface';
import { UserPassDto } from '@src/common/dtos/user-pass.dto';

@Injectable()
export class UserPassService {
  constructor(private readonly passRepository: PassRepository) {}

  async getPassList(
    userId: number,
    dto: GetUserPassListDto,
  ): Promise<{ totalItemCount: number; userPassList: UserPassDto[] }> {
    const paginationParams: IPaginationParams = generatePaginationParams(dto);

    const totalItemCount = await this.passRepository.countUserPassList(userId);
    if (totalItemCount === 0) {
      return { totalItemCount, userPassList: [] };
    }

    const userPassList = await this.passRepository.getUserPassList(
      userId,
      paginationParams,
    );

    return { totalItemCount, userPassList };
  }
}
