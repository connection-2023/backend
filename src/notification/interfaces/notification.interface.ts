export interface INotificationTarget {
  userId?: number;
  lecturerId?: number;
}

export interface INotificationSource {
  lectureId?: number;
  reservationId?: number;
  couponId?: number;
  lecturePassId?: number;
  userPassId?: number;
}
