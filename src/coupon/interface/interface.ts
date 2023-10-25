interface CouponInputData {
  id?: number;
  lecturerId: number;
  title: string;
  isStackable: boolean;
  percentage?: number | null;
  discountPrice?: number | null;
  maxDiscountPrice?: number | null;
  maxUsageCount?: number | null;
  usageCount?: number;
  isDisabled?: boolean;

  startAt: Date | string;
  endAt: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}

interface LectureData {
  id: number;
  lecturerId: number;
}

interface CouponTargetInputData {
  lectureId: number;
  lectureCouponId: number;
}

export { CouponInputData, LectureData, CouponTargetInputData };
