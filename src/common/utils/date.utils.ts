import { IConvertedDate } from '../interface/common-interface';

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
  ): IConvertedDate {
    const convertedStartDate = startDate ? new Date(startDate) : new Date();
    convertedStartDate.setUTCHours(0, 0, 0, 0); // UTC 기준 시작 시간 설정

    const convertedEndDate = endDate
      ? new Date(endDate)
      : new Date(convertedStartDate);
    convertedEndDate.setUTCHours(23, 59, 59, 999); // UTC 기준 종료 시간 설정

    return { convertedStartDate, convertedEndDate };
  }

  /**
   * 특정 달의 1일과  마지막 일을 반환.
   * @param year 연도
   * @param month 월 (1월은 0, 12월은 11)
   * @returns 시작 시간, 종료 시간
   */
  static getUTCStartAndEndOfMonth(year: number, month: number): IConvertedDate {
    const convertedStartDate = new Date(Date.UTC(year, month, 1));
    convertedStartDate.setUTCHours(0, 0, 0, 0); // UTC 기준 시작 시간 설정

    const convertedEndDate = new Date(Date.UTC(year, month + 1, 0));
    convertedEndDate.setUTCHours(23, 59, 59, 999); // UTC 기준 종료 시간 설정

    return { convertedStartDate, convertedEndDate };
  }
}
