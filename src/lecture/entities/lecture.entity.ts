import { ApiProperty } from '@nestjs/swagger';

export class LectureEntity {
  @ApiProperty({
    description: '클래스 제목',
    example: '락킹클래스',
  })
  title: string;

  @ApiProperty({
    description: '클래스 위치',
    example: '?',
  })
  detailAddress: string;

  @ApiProperty({
    description: '강의 시간?',
  })
  duration: number;

  @ApiProperty({
    description: '난이도',
  })
  difficultLevel: string;

  @ApiProperty({
    description: '비그룹 최대정원',
    example: 8,
  })
  maxCapacity: number | null;

  @ApiProperty({
    description: '비그룹 최소인원',
    example: 1,
  })
  minCapacity: number;

  @ApiProperty({
    description: '그룹 여부',
    example: 'true',
  })
  isGroup: boolean;

  @ApiProperty({
    description: '강의예약 마감일',
    example: '2023-08-27',
  })
  reservation_deadline: Date;

  @ApiProperty({
    description: '예약 설명',
    example: '?',
  })
  reservation_comment: string | null;

  @ApiProperty({
    description: '가격',
    example: 40000,
  })
  price: number;

  @ApiProperty({
    description: '선금',
    example: 10000,
  })
  noShowDeposit: number | null;

  @ApiProperty({
    description: '리뷰 수',
    example: 180,
  })
  reviewCount: number;

  @ApiProperty({
    description: '별점',
    example: 5,
  })
  stars: number;
}
