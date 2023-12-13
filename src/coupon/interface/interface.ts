import { string } from 'joi';

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
  isPrivate: boolean;
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

interface CouponUpdateData {
  title: string;
  percentage: number;
  discountPrice: number;
  maxDiscountPrice: number;
  maxUsageCount: number;
  endAt: Date;
  isStackable: boolean;
  isPrivate: boolean;
}

export {
  CouponInputData,
  LectureData,
  CouponTargetInputData,
  CouponUpdateData,
};
