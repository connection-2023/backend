export class DateUtils {
  /**
   * 시작 시간과 종료 시간을 반환.
   * 빈 값을 넣으면 현재 날짜를 기준으로 00시, 23:59:59:999반환
   * @param startDate 시작 시간
   * @param endDate 종료 시간
   * @returns 시작 시간, 종료 시간
   */
  static getUTCStartAndEndOfRange(
    startDate?: Date,
    endDate?: Date,
  ): { startOfDay: Date; endOfDay: Date } {
    const startOfDay = startDate || new Date();
    startOfDay.setUTCHours(0, 0, 0, 0); // UTC 기준 시작 시간 설정

    const endOfDay = endDate || new Date();
    endOfDay.setUTCHours(23, 59, 59, 999); // UTC 기준 종료 시간 설정

    return { startOfDay, endOfDay };
  }

  /**
   * 특정 달의 시작 시간과 종료 시간을 반환.
   * @param year 연도
   * @param month 월 (1월은 0, 12월은 11)
   * @returns 시작 시간, 종료 시간
   */
  static getUTCStartAndEndOfMonth(
    year: number,
    month: number,
  ): { startOfMonth: Date; endOfMonth: Date } {
    const startOfMonth = new Date(Date.UTC(year, month, 1));
    startOfMonth.setUTCHours(0, 0, 0, 0); // UTC 기준 시작 시간 설정

    const endOfMonth = new Date(Date.UTC(year, month + 1, 0));
    endOfMonth.setUTCHours(23, 59, 59, 999); // UTC 기준 종료 시간 설정

    return { startOfMonth, endOfMonth };
  }
}
