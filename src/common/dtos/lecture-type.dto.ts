import { ApiProperty } from '@nestjs/swagger';
import { LectureType } from '@prisma/client';

export class LectureTypeDto implements LectureType {
  @ApiProperty({
    description: '종류 id',
  })
  id: number;

  @ApiProperty({
    description: '강의 종류 (dance,drawing)',
  })
  name: string;

  constructor(lectureType: Partial<LectureTypeDto>) {
    this.id = lectureType.id;
    this.name = lectureType.name;

    Object.assign(this);
  }
}
