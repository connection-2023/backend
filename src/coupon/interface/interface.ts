interface CouponInputData {
  id?: number;
  lecturerId: number;
  title: string;
  description?: string | null;
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

export { CouponInputData };
