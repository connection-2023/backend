import { ApiProperty } from '@nestjs/swagger';

export class LectureMethodDto implements LectureMethodDto {
  @ApiProperty({
    description: '종류 id',
  })
  id: number;

  @ApiProperty({
    description: '원데이,정기',
  })
  name: string;

  constructor(lectureMethod: Partial<LectureMethodDto>) {
    this.id = lectureMethod.id;
    this.name = lectureMethod.name;

    Object.assign(this);
  }
}
