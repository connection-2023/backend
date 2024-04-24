export interface INotificationTarget {
  userId?: number;
  lecturerId?: number;
}

export interface INotificationSource {
  lecturerId?: number;
  lectureId?: number;
  reservationId?: number;
  couponId?: number;
  lecturePassId?: number;
  userPassId?: number;
  userId?: number;
}
