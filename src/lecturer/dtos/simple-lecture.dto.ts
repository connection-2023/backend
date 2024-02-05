import { ApiProperty } from '@nestjs/swagger';
import { Lecture } from '@prisma/client';
import { BaseReturnWithSwaggerDto } from '../../common/dtos/base-return-with-swagger.dto';
import { BaseReturnDto } from '@src/common/dtos/base-return.dto';
import { Exclude, Expose } from 'class-transformer';
import { LecturerDto } from '@src/common/dtos/lecturer.dto';

@Exclude()
export class SimpleLectureDto extends BaseReturnDto implements Lecture {
  @ApiProperty({
    description: '강의 id',
    type: Number,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: '강의 제목',
  })
  @Expose()
  title: string;

  lecturerId: number;
  lectureTypeId: number;
  lectureMethodId: number;
  isGroup: boolean;
  startDate: Date;
  endDate: Date;
  introduction: string;
  curriculum: string;
  duration: number;
  difficultyLevel: string;
  minCapacity: number;
  maxCapacity: number;
  reservationDeadline: number;
  reservationComment: string;
  price: number;
  noShowDeposit: number;
  reviewCount: number;
  stars: number;
  isActive: boolean;
  locationDescription: string;
  deletedAt: Date;
  lecturer?: LecturerDto;

  constructor(lecture: Partial<SimpleLectureDto>) {
    super();

    Object.assign(this, lecture);
  }
}
