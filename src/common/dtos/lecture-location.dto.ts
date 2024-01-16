import { ApiProperty } from '@nestjs/swagger';

export class LectureLocationDto {
  @ApiProperty({ description: '강의 지역 id', type: Number })
  id: number;

  @ApiProperty({ description: '주소' })
  address: string;

  @ApiProperty({ description: '상세주소' })
  detailAddress: string;

  @ApiProperty({ description: '건물명' })
  buildingName: string;

  constructor(lectureLocation: Partial<LectureLocationDto>) {
    this.id = lectureLocation.id;
    this.address = lectureLocation.address;
    this.detailAddress = lectureLocation.detailAddress;
    this.buildingName = lectureLocation.buildingName;

    Object.assign(this);
  }
}
