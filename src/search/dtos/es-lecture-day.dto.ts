import { ApiProperty } from '@nestjs/swagger';

export class EsLectureDayDto {
  @ApiProperty({
    description: '요일',
    example: ['월', '수'],
    isArray: true,
  })
  day: string[];

  @ApiProperty({
    description: '강의 시간',
    example: ['HH:mm:ss'],
    isArray: true,
  })
  dateTime: string[];

  constructor(lectureDay: Partial<EsLectureDayDto>) {
    this.day = lectureDay.day;
    this.dateTime = lectureDay.dateTime;

    Object.assign(this);
  }
}
