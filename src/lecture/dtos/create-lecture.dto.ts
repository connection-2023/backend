import { ApiProperty } from '@nestjs/swagger';

export class CreateLectureDto {
  @ApiProperty({ example: 1, description: '지역 id', required: true })
  regionId: number;

  @ApiProperty({ example: 1, description: '강의 종류 id', required: true })
  lectureTypeId: number;

  @ApiProperty({ example: 1, description: '춤 장르 id', required: true })
  danceCategoryId: number;

  @ApiProperty({ example: 1, description: '강의 인원 형식 id', required: true })
  lectureMethodId: number;

  @ApiProperty({
    example: '가비쌤과 함께하는 왁킹 클래스',
    description: '강의 제목',
    required: true,
  })
  title: string;

  @ApiProperty({
    example: '용마산로 616 18층',
    description: '상세주소',
    required: true,
  })
  detailAddress: string;

  @ApiProperty({ example: 2, description: '강의시간', required: true })
  duration: number;

  @ApiProperty({
    example: '상',
    description: '강의 난이도 상 중 하?',
    required: true,
  })
  difficultyLevel: string;

  @ApiProperty({ example: 1, description: '최소 정원', required: true })
  minCapacity: number;

  @ApiProperty({ example: 12, description: '최대 정원', required: false })
  maxCapacity: number | null;

  @ApiProperty({ example: true, description: '그룹 여부', required: true })
  isGroup: boolean;

  @ApiProperty({
    example: '2023 - 09 - 14',
    description: '강의 예약 마감일',
    required: true,
  })
  reservationDeadline: Date;

  @ApiProperty({
    example: '누구나 가능한!',
    description: '예약설명',
    required: false,
  })
  reservationComment: string | null;

  @ApiProperty({ example: 40000, description: '가격', required: true })
  price: number;

  @ApiProperty({
    example: 30000,
    description: '노쇼 방지 선금',
    required: false,
  })
  noShowDeposit: number | null;
}
