import { ApiProperty } from '@nestjs/swagger';
import {
  IEsPass,
  IEsSimpleLecturer,
} from '@src/search/interface/search.interface';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

@Exclude()
class EsPassTargetDto {
  @ApiProperty({
    description: '강의 제목',
  })
  @Expose()
  title: string;

  @ApiProperty({
    type: Number,
    description: '강의 Id',
  })
  @Expose()
  lectureId: number;
}

@Exclude()
class EsPassLecturerDto {
  @ApiProperty({
    type: Number,
    description: '강사 Id',
  })
  @Expose()
  lecturerId: number;

  @ApiProperty({
    description: '닉네임',
  })
  @Expose()
  nickname: string;

  @ApiProperty({
    description: '프로필 이미지',
  })
  @Expose()
  profileCardImageUrl: string;
}

@Exclude()
export class EsPassDto {
  @ApiProperty({
    type: [Number],
    description: '페이지네이션 타겟 배열',
  })
  @Expose()
  searchAfter: number[];

  @ApiProperty({
    type: Number,
    description: '패스권 id',
  })
  @Expose()
  id: number;

  @ApiProperty({
    type: Number,
    description: '가격',
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: '패스권 제목',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: '최대 사용 횟수',
  })
  @Transform(({ obj }) => obj.maxusagecount, {
    toClassOnly: true,
  })
  @Expose()
  maxUsageCount: number;

  @ApiProperty({
    description: '사용 가능 기간',
  })
  @Transform(({ obj }) => obj.availablemonths, {
    toClassOnly: true,
  })
  @Expose()
  availableMonths: number;

  @ApiProperty({
    description: '패스권 적용 대상',
    type: [EsPassTargetDto],
  })
  @Expose()
  @Type(() => EsPassTargetDto)
  lecturePassTarget: EsPassTargetDto[];

  @ApiProperty({
    description: '판매자',
    type: EsPassLecturerDto,
  })
  @Expose()
  @Type(() => EsPassLecturerDto)
  lecturer: EsPassLecturerDto;

  constructor(pass: Partial<IEsPass>) {
    if (pass) {
      Object.assign(this, pass);
      this.maxUsageCount = pass.maxusagecount;
      this.availableMonths = pass.availablemonths;
    }
  }
}
